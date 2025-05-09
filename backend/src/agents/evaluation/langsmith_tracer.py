"""
LangSmith tracer implementation for AgentForge OSS.
This module provides tracing capabilities using LangSmith.
"""

import logging
import json
import os
from typing import Dict, List, Any, Optional, Union
import datetime
import uuid

from ..core.agent_types import TracerConfig, LLMConfig
from . import BaseTracer

logger = logging.getLogger(__name__)

class LangSmithTracer(BaseTracer):
    """LangSmith tracer for agent evaluation and benchmarking"""
    
    def __init__(self, config: TracerConfig):
        """Initialize the LangSmith tracer"""
        super().__init__(config)
        self.api_key = config.extra_params.get("langsmith_api_key")
        self.project_name = config.extra_params.get("project_name", "agentforge")
        self.client = None
        self.current_run_id = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize the LangSmith client"""
        if not self.enabled:
            return
            
        try:
            from langsmith import Client
            
            # Check if API key is available
            if not self.api_key:
                self.api_key = os.environ.get("LANGCHAIN_API_KEY")
                
            if not self.api_key:
                logger.warning("LangSmith API key not found. Disabling LangSmith tracing.")
                self.enabled = False
                return
                
            # Initialize client
            self.client = Client(api_key=self.api_key)
            logger.info(f"LangSmith tracer initialized with project: {self.project_name}")
            
        except ImportError:
            logger.warning("LangSmith package not installed. Please install with: pip install langsmith")
            self.enabled = False
        except Exception as e:
            logger.error(f"Error initializing LangSmith client: {e}")
            self.enabled = False
    
    def start_trace(self, task: Any) -> None:
        """
        Start a new trace for a task.
        
        Args:
            task: The task being traced
        """
        if not self.enabled or self.client is None:
            return
            
        try:
            from langsmith.run_trees import RunTree
            
            # Extract task information
            task_id = getattr(task, "id", str(uuid.uuid4()))
            task_query = getattr(task, "query", str(task))
            agent_type = getattr(task, "agent_type", "unknown")
            
            # Create a run
            run_id = str(uuid.uuid4())
            
            # Create a run in LangSmith
            run = self.client.create_run(
                name=f"Task: {task_query[:50]}...",
                run_type="chain",
                inputs={"query": task_query},
                extra={
                    "task_id": str(task_id),
                    "agent_type": agent_type
                },
                execution_order=1,
                project_name=self.project_name,
                id=run_id
            )
            
            self.current_run_id = run_id
            self.current_trace = {
                "task_id": task_id,
                "run_id": run_id,
                "start_time": datetime.datetime.now().isoformat(),
                "children": []
            }
            
            logger.info(f"Started LangSmith trace for task {task_id} with run ID {run_id}")
            
        except Exception as e:
            logger.error(f"Error starting LangSmith trace: {e}")
            self.current_trace = None
    
    def end_trace(self) -> None:
        """End the current trace"""
        if not self.enabled or self.client is None or self.current_trace is None:
            return
            
        try:
            # Update the run with outputs and end it
            self.client.update_run(
                run_id=self.current_trace["run_id"],
                outputs={"completed": True},
                end_time=datetime.datetime.now(),
                status="completed"
            )
            
            logger.info(f"Ended LangSmith trace with run ID {self.current_trace['run_id']}")
            self.current_trace = None
            self.current_run_id = None
            
        except Exception as e:
            logger.error(f"Error ending LangSmith trace: {e}")
    
    def log_model_selection(self, model_config: LLMConfig, reason: str) -> None:
        """
        Log model selection information.
        
        Args:
            model_config: The selected model configuration
            reason: The reason for selecting this model
        """
        if not self.enabled or self.client is None or self.current_trace is None:
            return
            
        try:
            # Create a child run for model selection
            child_run_id = str(uuid.uuid4())
            
            self.client.create_run(
                name="Model Selection",
                run_type="llm",
                inputs={},
                outputs={
                    "model": model_config.model_path,
                    "backend": model_config.backend,
                    "reason": reason
                },
                extra={
                    "quantization": model_config.quantization,
                    "tensor_parallel_size": model_config.tensor_parallel_size
                },
                parent_run_id=self.current_trace["run_id"],
                execution_order=len(self.current_trace["children"]) + 2,
                id=child_run_id
            )
            
            # Update the end time
            self.client.update_run(
                run_id=child_run_id,
                end_time=datetime.datetime.now(),
                status="completed"
            )
            
            # Track the child run
            self.current_trace["children"].append(child_run_id)
            
            logger.debug(f"Logged model selection in LangSmith: {model_config.model_path}")
            
        except Exception as e:
            logger.error(f"Error logging model selection to LangSmith: {e}")
    
    def log_plan(self, plan: Dict[str, Any]) -> None:
        """
        Log a plan generated by the agent.
        
        Args:
            plan: The agent's plan
        """
        if not self.enabled or self.client is None or self.current_trace is None:
            return
            
        try:
            # Create a child run for plan generation
            child_run_id = str(uuid.uuid4())
            
            self.client.create_run(
                name="Plan Generation",
                run_type="chain",
                inputs={},
                outputs={"plan": plan},
                parent_run_id=self.current_trace["run_id"],
                execution_order=len(self.current_trace["children"]) + 2,
                id=child_run_id
            )
            
            # Update the end time
            self.client.update_run(
                run_id=child_run_id,
                end_time=datetime.datetime.now(),
                status="completed"
            )
            
            # Track the child run
            self.current_trace["children"].append(child_run_id)
            
            logger.debug("Logged plan in LangSmith")
            
        except Exception as e:
            logger.error(f"Error logging plan to LangSmith: {e}")
    
    def log_tool_start(self, tool_name: str, tool_input: Any) -> None:
        """
        Log the start of a tool execution.
        
        Args:
            tool_name: The name of the tool
            tool_input: The input to the tool
        """
        if not self.enabled or self.client is None or self.current_trace is None:
            return
            
        try:
            # Create a child run for tool execution
            child_run_id = str(uuid.uuid4())
            
            # Store the tool execution details for later completion
            tool_run = {
                "run_id": child_run_id,
                "tool_name": tool_name,
                "start_time": datetime.datetime.now()
            }
            
            self.client.create_run(
                name=f"Tool: {tool_name}",
                run_type="tool",
                inputs={"input": tool_input},
                parent_run_id=self.current_trace["run_id"],
                execution_order=len(self.current_trace["children"]) + 2,
                id=child_run_id
            )
            
            # Track the child run
            self.current_trace["children"].append(child_run_id)
            
            # Store the current tool run for later completion
            self.current_trace["current_tool"] = tool_run
            
            logger.debug(f"Logged tool start in LangSmith: {tool_name}")
            
        except Exception as e:
            logger.error(f"Error logging tool start to LangSmith: {e}")
    
    def log_tool_end(self, tool_name: str, tool_output: Any) -> None:
        """
        Log the end of a tool execution.
        
        Args:
            tool_name: The name of the tool
            tool_output: The output from the tool
        """
        if not self.enabled or self.client is None or self.current_trace is None:
            return
            
        # Check if we have a current tool execution
        if "current_tool" not in self.current_trace:
            logger.warning(f"Tool end logged without corresponding start: {tool_name}")
            return
            
        tool_run = self.current_trace["current_tool"]
        
        # Verify it's the same tool
        if tool_run["tool_name"] != tool_name:
            logger.warning(f"Tool end doesn't match start: {tool_name} vs {tool_run['tool_name']}")
            
        try:
            # Update the run with outputs and end it
            self.client.update_run(
                run_id=tool_run["run_id"],
                outputs={"output": tool_output},
                end_time=datetime.datetime.now(),
                status="completed"
            )
            
            # Clear the current tool
            self.current_trace.pop("current_tool", None)
            
            logger.debug(f"Logged tool end in LangSmith: {tool_name}")
            
        except Exception as e:
            logger.error(f"Error logging tool end to LangSmith: {e}")
    
    def log_error(self, error: Union[str, Exception]) -> None:
        """
        Log an error that occurred during agent execution.
        
        Args:
            error: The error that occurred
        """
        if not self.enabled or self.client is None or self.current_trace is None:
            return
            
        try:
            error_str = str(error)
            error_type = type(error).__name__ if isinstance(error, Exception) else "Unknown"
            
            # Create a child run for the error
            child_run_id = str(uuid.uuid4())
            
            self.client.create_run(
                name=f"Error: {error_type}",
                run_type="chain",
                inputs={},
                outputs={"error_message": error_str},
                extra={"error_type": error_type},
                parent_run_id=self.current_trace["run_id"],
                execution_order=len(self.current_trace["children"]) + 2,
                id=child_run_id
            )
            
            # Update the end time
            self.client.update_run(
                run_id=child_run_id,
                end_time=datetime.datetime.now(),
                status="error"
            )
            
            # Update the parent run as well
            self.client.update_run(
                run_id=self.current_trace["run_id"],
                status="error"
            )
            
            # Track the child run
            self.current_trace["children"].append(child_run_id)
            
            logger.debug(f"Logged error in LangSmith: {error_type}: {error_str}")
            
        except Exception as e:
            logger.error(f"Error logging error to LangSmith: {e}")
    
    def get_traces(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get recent traces.
        
        Args:
            limit: The maximum number of traces to return
            
        Returns:
            A list of traces
        """
        if not self.enabled or self.client is None:
            return []
            
        try:
            # Get runs from LangSmith
            runs = self.client.list_runs(
                project_name=self.project_name,
                run_type="chain",
                execution_order=1,  # Only get parent runs
                limit=limit
            )
            
            # Convert to our trace format
            traces = []
            for run in runs:
                trace = {
                    "id": run.id,
                    "task_id": run.extra.get("task_id"),
                    "start_time": run.start_time,
                    "end_time": run.end_time,
                    "status": run.status,
                    "inputs": run.inputs,
                    "outputs": run.outputs
                }
                traces.append(trace)
                
            return traces
            
        except Exception as e:
            logger.error(f"Error getting traces from LangSmith: {e}")
            return []
    
    def get_trace(self, trace_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a specific trace by ID.
        
        Args:
            trace_id: The ID of the trace to retrieve
            
        Returns:
            The trace, or None if not found
        """
        if not self.enabled or self.client is None:
            return None
            
        try:
            # Get the run from LangSmith
            run = self.client.get_run(trace_id)
            
            # Convert to our trace format
            trace = {
                "id": run.id,
                "task_id": run.extra.get("task_id"),
                "start_time": run.start_time,
                "end_time": run.end_time,
                "status": run.status,
                "inputs": run.inputs,
                "outputs": run.outputs
            }
            
            # Get child runs
            child_runs = self.client.list_runs(parent_run_id=trace_id)
            
            tools = []
            models = []
            plans = []
            errors = []
            
            for child in child_runs:
                if child.run_type == "tool":
                    tools.append({
                        "tool_name": child.name.replace("Tool: ", ""),
                        "input": child.inputs.get("input"),
                        "output": child.outputs.get("output"),
                        "start_time": child.start_time,
                        "end_time": child.end_time
                    })
                elif child.name == "Model Selection":
                    models.append({
                        "model": child.outputs.get("model"),
                        "backend": child.outputs.get("backend"),
                        "reason": child.outputs.get("reason"),
                        "time": child.start_time
                    })
                elif child.name == "Plan Generation":
                    plans.append({
                        "plan": child.outputs.get("plan"),
                        "time": child.start_time
                    })
                elif child.name.startswith("Error:"):
                    errors.append({
                        "error_type": child.extra.get("error_type"),
                        "error_message": child.outputs.get("error_message"),
                        "time": child.start_time
                    })
            
            trace["tools"] = tools
            trace["models"] = models
            trace["plans"] = plans
            trace["errors"] = errors
            
            return trace
            
        except Exception as e:
            logger.error(f"Error getting trace {trace_id} from LangSmith: {e}")
            return None
    
    def export_trace(self, trace_id: str, format: str = "json") -> Any:
        """
        Export a trace in a specific format.
        
        Args:
            trace_id: The ID of the trace to export
            format: The format to export in (e.g., "json", "html", "markdown")
            
        Returns:
            The exported trace
        """
        if not self.enabled or self.client is None:
            return None
            
        trace = self.get_trace(trace_id)
        if not trace:
            return None
            
        if format == "json":
            return json.dumps(trace, indent=2, default=str)
        elif format == "html":
            # Return a simple HTML view
            run_url = f"https://smith.langchain.com/public/{trace_id}"
            html = f"""
            <html>
            <head>
                <title>Trace {trace_id}</title>
                <style>
                    body {{ font-family: Arial, sans-serif; margin: 20px; }}
                </style>
            </head>
            <body>
                <h1>Trace {trace_id}</h1>
                <p>View this trace in LangSmith: <a href="{run_url}" target="_blank">{run_url}</a></p>
                <h2>Task</h2>
                <p><strong>Query:</strong> {trace["inputs"].get("query", "N/A")}</p>
                <p><strong>Status:</strong> {trace["status"]}</p>
                
                <h2>Models Used</h2>
                <ul>
            """
            
            for model in trace.get("models", []):
                html += f"""
                <li>
                    <strong>{model["model"]}</strong> ({model["backend"]})<br>
                    Reason: {model["reason"]}
                </li>
                """
                
            html += """
                </ul>
                
                <h2>Tools Used</h2>
                <ul>
            """
            
            for tool in trace.get("tools", []):
                html += f"""
                <li>
                    <strong>{tool["tool_name"]}</strong><br>
                    Input: {tool["input"]}<br>
                    Output: {tool["output"]}
                </li>
                """
                
            html += """
                </ul>
            </body>
            </html>
            """
            
            return html
            
        elif format == "markdown":
            # Return a markdown view
            run_url = f"https://smith.langchain.com/public/{trace_id}"
            md = f"""# Trace {trace_id}

View this trace in LangSmith: [{run_url}]({run_url})

## Task
- **Query:** {trace["inputs"].get("query", "N/A")}
- **Status:** {trace["status"]}

## Models Used
"""
            
            for model in trace.get("models", []):
                md += f"""
- **{model["model"]}** ({model["backend"]})
  - Reason: {model["reason"]}
"""
                
            md += """
## Tools Used
"""
            
            for tool in trace.get("tools", []):
                md += f"""
- **{tool["tool_name"]}**
  - Input: `{tool["input"]}`
  - Output: `{tool["output"]}`
"""
                
            return md
            
        else:
            logger.error(f"Unsupported export format: {format}")
            return None
    
    def compare_traces(self, trace_ids: List[str]) -> Dict[str, Any]:
        """
        Compare multiple traces.
        
        Args:
            trace_ids: The IDs of the traces to compare
            
        Returns:
            A comparison of the traces
        """
        if not self.enabled or self.client is None:
            return {}
            
        traces = []
        for trace_id in trace_ids:
            trace = self.get_trace(trace_id)
            if trace:
                traces.append(trace)
                
        if not traces:
            return {}
            
        # Generate comparison
        comparison = {
            "traces": trace_ids,
            "summary": {},
            "models": {},
            "tools": {},
            "performance": {}
        }
        
        # Compare metrics
        for trace in traces:
            trace_id = trace["id"]
            
            # Duration calculation
            if trace["start_time"] and trace["end_time"]:
                try:
                    start = datetime.datetime.fromisoformat(str(trace["start_time"]).replace("Z", "+00:00"))
                    end = datetime.datetime.fromisoformat(str(trace["end_time"]).replace("Z", "+00:00"))
                    duration = (end - start).total_seconds()
                except (ValueError, TypeError):
                    duration = None
            else:
                duration = None
                
            # Model info
            models_used = []
            for model in trace.get("models", []):
                models_used.append(model["model"])
                
            # Tool usage
            tool_counts = {}
            for tool in trace.get("tools", []):
                tool_name = tool["tool_name"]
                tool_counts[tool_name] = tool_counts.get(tool_name, 0) + 1
                
            # Add to comparison
            comparison["summary"][trace_id] = {
                "status": trace["status"],
                "duration": duration,
                "error_count": len(trace.get("errors", []))
            }
            
            comparison["models"][trace_id] = models_used
            comparison["tools"][trace_id] = tool_counts
            comparison["performance"][trace_id] = {
                "duration": duration,
                "tool_count": len(trace.get("tools", [])),
                "model_count": len(trace.get("models", []))
            }
            
        return comparison 