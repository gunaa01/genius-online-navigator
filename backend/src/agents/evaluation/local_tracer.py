"""
Local filesystem-based tracer implementation for AgentForge OSS.
This module provides tracing capabilities that store data in the local filesystem.
"""

import json
import os
import uuid
import time
import logging
import datetime
from typing import Dict, List, Any, Optional, Union
from pathlib import Path
import threading

from ..core.agent_types import TracerConfig, Task, AgentResult, LLMConfig
from . import BaseTracer

logger = logging.getLogger(__name__)

class LocalTracer(BaseTracer):
    """Local filesystem-based tracer for agent execution"""
    
    def __init__(self, config: TracerConfig):
        """Initialize the tracer with a configuration"""
        super().__init__(config)
        self.storage_path = Path(config.storage_path)
        self.traces: Dict[str, Dict[str, Any]] = {}
        self.lock = threading.Lock()
        self._ensure_storage_path()
        
        self.current_trace = None
        self.current_trace_id = None
    
    def _ensure_storage_path(self):
        """Ensure the storage path exists"""
        if self.enabled:
            try:
                os.makedirs(self.storage_path, exist_ok=True)
                logger.info(f"Trace storage path created: {self.storage_path}")
            except Exception as e:
                logger.error(f"Failed to create trace storage path: {e}")
                self.enabled = False
    
    def _get_trace_path(self, trace_id: str) -> Path:
        """Get the path to a trace file"""
        return self.storage_path / f"trace_{trace_id}.json"
    
    def _save_trace(self, trace_id: str, trace_data: Dict[str, Any]):
        """Save a trace to disk"""
        if not self.enabled:
            return
        
        try:
            with open(self._get_trace_path(trace_id), 'w') as f:
                json.dump(trace_data, f, indent=2, default=str)
        except Exception as e:
            logger.error(f"Failed to save trace {trace_id}: {e}")
    
    def start_trace(self, task: Task) -> None:
        """Start a new trace for a task"""
        if not self.enabled:
            return
        
        # Generate a trace ID
        trace_id = str(uuid.uuid4())
        
        # Create trace data
        trace_data = {
            "id": trace_id,
            "task_id": getattr(task, "id", str(uuid.uuid4())),
            "task_query": getattr(task, "query", str(task)),
            "agent_type": getattr(task, "agent_type", "unknown"),
            "start_time": datetime.datetime.now().isoformat(),
            "end_time": None,
            "duration_seconds": None,
            "status": "running",
            "model_selection": None,
            "plan": None,
            "tools": [],
            "errors": [],
            "metrics": {}
        }
        
        # Store the trace
        with self.lock:
            self.traces[trace_id] = trace_data
            self.current_trace = trace_id
        
        # Save to disk
        self._save_trace(trace_id, trace_data)
        
        logger.info(f"Started trace {trace_id} for task: {getattr(task, 'query', str(task))}")
    
    def end_trace(self) -> None:
        """End the current trace"""
        if not self.enabled or self.current_trace is None:
            return
        
        trace_id = self.current_trace
        
        with self.lock:
            if trace_id in self.traces:
                # Update trace data
                trace_data = self.traces[trace_id]
                trace_data["end_time"] = datetime.datetime.now().isoformat()
                
                # Calculate duration
                try:
                    start_time = datetime.datetime.fromisoformat(trace_data["start_time"])
                    end_time = datetime.datetime.fromisoformat(trace_data["end_time"])
                    trace_data["duration_seconds"] = (end_time - start_time).total_seconds()
                except (ValueError, TypeError):
                    trace_data["duration_seconds"] = None
                
                # Set status if not already failed
                if trace_data["status"] != "failed":
                    trace_data["status"] = "completed"
                
                # Calculate metrics
                tool_counts = {}
                for tool_event in trace_data["tools"]:
                    tool_name = tool_event.get("tool_name")
                    if tool_name:
                        tool_counts[tool_name] = tool_counts.get(tool_name, 0) + 1
                
                trace_data["metrics"]["tool_counts"] = tool_counts
                trace_data["metrics"]["total_tool_calls"] = len(trace_data["tools"])
                trace_data["metrics"]["error_count"] = len(trace_data["errors"])
                
                # Add model info to metrics if available
                if trace_data.get("model_selection"):
                    trace_data["metrics"]["model"] = trace_data["model_selection"]["model_path"]
                    trace_data["metrics"]["model_backend"] = trace_data["model_selection"]["backend"]
                
                # Save to disk
                self._save_trace(trace_id, trace_data)
                
                logger.info(f"Ended trace {trace_id}, duration: {trace_data['duration_seconds']} seconds")
            
            self.current_trace = None
    
    def log_model_selection(self, model_config: LLMConfig, reason: str) -> None:
        """Log model selection information"""
        if not self.enabled or self.current_trace is None:
            return
        
        trace_id = self.current_trace
        
        with self.lock:
            if trace_id in self.traces:
                # Update trace data with model selection info
                trace_data = self.traces[trace_id]
                
                model_selection = {
                    "backend": model_config.backend,
                    "model_path": model_config.model_path,
                    "quantization": model_config.quantization,
                    "tensor_parallel_size": model_config.tensor_parallel_size,
                    "selection_time": datetime.datetime.now().isoformat(),
                    "reason": reason,
                    "extra_params": model_config.extra_params
                }
                
                trace_data["model_selection"] = model_selection
                
                # Save to disk
                self._save_trace(trace_id, trace_data)
                
                logger.debug(f"Logged model selection for trace {trace_id}: {model_config.model_path}")
    
    def log_plan(self, plan: Dict[str, Any]) -> None:
        """Log a plan generated by the agent"""
        if not self.enabled or self.current_trace is None:
            return
        
        # Add plan event
        self._add_event("plan", {"plan": plan})
        
        logger.debug("Logged agent plan")
    
    def log_tool_start(self, tool_name: str, tool_input: Any) -> None:
        """Log the start of a tool execution"""
        if not self.enabled or self.current_trace is None:
            return
        
        # Increment tool calls counter
        self.current_trace["metrics"]["num_tool_calls"] += 1
        
        # Add tool start event
        self._add_event("tool_start", {
            "tool_name": tool_name,
            "tool_input": tool_input
        })
        
        logger.debug(f"Logged start of tool: {tool_name}")
    
    def log_tool_end(self, tool_name: str, tool_output: Any) -> None:
        """Log the end of a tool execution"""
        if not self.enabled or self.current_trace is None:
            return
        
        # Add tool end event
        self._add_event("tool_end", {
            "tool_name": tool_name,
            "tool_output": tool_output
        })
        
        logger.debug(f"Logged end of tool: {tool_name}")
    
    def log_error(self, error: Union[str, Exception]) -> None:
        """Log an error that occurred during agent execution"""
        if not self.enabled or self.current_trace is None:
            return
        
        error_str = str(error)
        error_type = type(error).__name__ if isinstance(error, Exception) else "Unknown"
        
        # Add error event
        self._add_event("error", {
            "error_type": error_type,
            "error_message": error_str
        })
        
        logger.debug(f"Logged error: {error_type}: {error_str}")
    
    def get_traces(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent traces"""
        if not self.enabled:
            return []
        
        traces = []
        
        try:
            files = [f for f in os.listdir(self.storage_path) if f.endswith(".json")]
            # Sort by modification time, newest first
            files.sort(key=lambda f: os.path.getmtime(os.path.join(self.storage_path, f)), reverse=True)
            
            # Load the traces
            for file in files[:limit]:
                path = os.path.join(self.storage_path, file)
                with open(path, "r") as f:
                    trace = json.load(f)
                    traces.append(trace)
        except Exception as e:
            logger.error(f"Error getting traces: {e}")
        
        return traces
    
    def get_trace(self, trace_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific trace by ID"""
        if not self.enabled:
            return None
        
        try:
            path = os.path.join(self.storage_path, f"{trace_id}.json")
            if not os.path.exists(path):
                return None
                
            with open(path, "r") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error getting trace {trace_id}: {e}")
            return None
    
    def export_trace(self, trace_id: str, format: str = "json") -> Any:
        """Export a trace in a specific format"""
        if not self.enabled:
            return None
            
        trace = self.get_trace(trace_id)
        if trace is None:
            return None
            
        if format == "json":
            return json.dumps(trace, indent=2, default=str)
        elif format == "html":
            return self._trace_to_html(trace)
        elif format == "markdown":
            return self._trace_to_markdown(trace)
        else:
            logger.error(f"Unsupported export format: {format}")
            return None
            
    def compare_traces(self, trace_ids: List[str]) -> Dict[str, Any]:
        """Compare multiple traces"""
        if not self.enabled:
            return {}
            
        traces = []
        for trace_id in trace_ids:
            trace = self.get_trace(trace_id)
            if trace:
                traces.append(trace)
                
        if not traces:
            return {}
            
        # Extract metrics for comparison
        comparison = {
            "trace_ids": trace_ids,
            "metrics": {},
            "models_used": {},
            "tool_usage": {}
        }
        
        for trace in traces:
            trace_id = trace["id"]
            
            # Add metrics
            comparison["metrics"][trace_id] = trace["metrics"]
            
            # Add model info
            if "model_selection" in trace and trace["model_selection"]:
                comparison["models_used"][trace_id] = {
                    "model_path": trace["model_selection"]["model_path"],
                    "backend": trace["model_selection"]["backend"]
                }
            
            # Count tool usage
            tool_counts = {}
            for event in trace["events"]:
                if event["type"] == "tool_start":
                    tool_name = event["data"]["tool_name"]
                    tool_counts[tool_name] = tool_counts.get(tool_name, 0) + 1
            
            comparison["tool_usage"][trace_id] = tool_counts
        
        return comparison
    
    def _add_event(self, event_type: str, data: Dict[str, Any]) -> None:
        """Add an event to the current trace"""
        if not self.enabled or self.current_trace is None:
            return
        
        # Increment step counter for certain event types
        if event_type in ["tool_start", "tool_end"]:
            self.current_trace["metrics"]["num_steps"] += 1
        
        # Create event
        event = {
            "timestamp": time.time(),
            "type": event_type,
            "data": data
        }
        
        # Add to events list
        self.current_trace["events"].append(event)
    
    def _trace_to_html(self, trace: Dict[str, Any]) -> str:
        """Convert a trace to HTML format"""
        try:
            html = f"""<!DOCTYPE html>
            <html>
            <head>
                <title>Trace {trace["id"]}</title>
                <style>
                    body {{ font-family: Arial, sans-serif; margin: 20px; }}
                    .section {{ margin-bottom: 20px; }}
                    .event {{ border: 1px solid #ddd; padding: 10px; margin-bottom: 5px; }}
                    .tool-start {{ background-color: #f0f8ff; }}
                    .tool-end {{ background-color: #f0fff0; }}
                    .error {{ background-color: #fff0f0; }}
                    .metrics {{ display: flex; flex-wrap: wrap; }}
                    .metric {{ width: 200px; margin-right: 20px; }}
                </style>
            </head>
            <body>
                <h1>Trace {trace["id"]}</h1>
                
                <div class="section">
                    <h2>Task</h2>
                    <pre>{json.dumps(trace["task"], indent=2, default=str)}</pre>
                </div>
                
                <div class="section">
                    <h2>Model Selection</h2>
                    <pre>{json.dumps(trace.get("model_selection", {}), indent=2, default=str)}</pre>
                </div>
                
                <div class="section">
                    <h2>Metrics</h2>
                    <div class="metrics">
            """
            
            for key, value in trace["metrics"].items():
                if key == "duration" and value is not None:
                    value = f"{value:.2f}s"
                html += f'<div class="metric"><strong>{key}:</strong> {value}</div>'
            
            html += """
                    </div>
                </div>
                
                <div class="section">
                    <h2>Events</h2>
            """
            
            for event in trace["events"]:
                event_type = event["type"]
                css_class = f"event {event_type}"
                
                html += f"""
                <div class="{css_class}">
                    <strong>{event_type}</strong> at {event["timestamp"]}
                    <pre>{json.dumps(event["data"], indent=2, default=str)}</pre>
                </div>
                """
            
            html += """
                </div>
            </body>
            </html>
            """
            
            return html
        except Exception as e:
            logger.error(f"Error generating HTML: {e}")
            return f"<html><body><h1>Error generating HTML</h1><p>{str(e)}</p></body></html>"
    
    def _trace_to_markdown(self, trace: Dict[str, Any]) -> str:
        """Convert a trace to Markdown format"""
        try:
            md = f"""# Trace {trace["id"]}

## Task
```json
{json.dumps(trace["task"], indent=2, default=str)}
```

## Model Selection
```json
{json.dumps(trace.get("model_selection", {}), indent=2, default=str)}
```

## Metrics
"""
            
            for key, value in trace["metrics"].items():
                if key == "duration" and value is not None:
                    value = f"{value:.2f}s"
                md += f"- **{key}:** {value}\n"
            
            md += "\n## Events\n"
            
            for event in trace["events"]:
                event_type = event["type"]
                
                md += f"""
### {event_type} at {event["timestamp"]}
```json
{json.dumps(event["data"], indent=2, default=str)}
```
"""
            
            return md
        except Exception as e:
            logger.error(f"Error generating Markdown: {e}")
            return f"# Error generating Markdown\n\n{str(e)}"