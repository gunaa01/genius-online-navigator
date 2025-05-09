"""
Model Router for the AgentForge OSS framework.
This module dynamically selects the best model for a given task.
"""

import logging
from typing import Dict, List, Any, Optional, Tuple
import json
import os
import time
from datetime import datetime

from ..agents.core.agent_types import LLMConfig, LLMBackendType, Task

logger = logging.getLogger(__name__)

class ModelRouter:
    """
    Model Router that dynamically selects the best model for a task.
    This implements the Model Router layer from the architecture.
    """
    
    def __init__(self, models_config: List[Dict[str, Any]]):
        """
        Initialize the model router with configurations for available models.
        
        Args:
            models_config: List of model configurations with metadata
        """
        self.models_config = models_config
        self.model_metrics = {}  # Track performance metrics for each model
        self.task_history = {}   # Track model performance per task type
        self.model_usage = {}    # Track model usage statistics
        self.last_evaluation = datetime.now()
        self._load_model_metrics()
        self._load_task_history()
    
    def _load_model_metrics(self):
        """Load stored model performance metrics if available"""
        metrics_path = os.path.join(os.path.dirname(__file__), "model_metrics.json")
        if os.path.exists(metrics_path):
            try:
                with open(metrics_path, "r") as f:
                    self.model_metrics = json.load(f)
                logger.info(f"Loaded metrics for {len(self.model_metrics)} models")
            except Exception as e:
                logger.error(f"Error loading model metrics: {e}")
    
    def _load_task_history(self):
        """Load stored task history if available"""
        history_path = os.path.join(os.path.dirname(__file__), "task_history.json")
        if os.path.exists(history_path):
            try:
                with open(history_path, "r") as f:
                    self.task_history = json.load(f)
                logger.info(f"Loaded history for {len(self.task_history)} task types")
            except Exception as e:
                logger.error(f"Error loading task history: {e}")
    
    def _save_model_metrics(self):
        """Save model performance metrics"""
        metrics_path = os.path.join(os.path.dirname(__file__), "model_metrics.json")
        try:
            with open(metrics_path, "w") as f:
                json.dump(self.model_metrics, f)
        except Exception as e:
            logger.error(f"Error saving model metrics: {e}")
    
    def _save_task_history(self):
        """Save task history"""
        history_path = os.path.join(os.path.dirname(__file__), "task_history.json")
        try:
            with open(history_path, "w") as f:
                json.dump(self.task_history, f)
        except Exception as e:
            logger.error(f"Error saving task history: {e}")
    
    def select_model(self, task: Task, context: Dict[str, Any]) -> Tuple[LLMConfig, str]:
        """
        Select the best model for a given task.
        
        Args:
            task: The task to be performed
            context: Additional context for model selection
            
        Returns:
            Tuple of (selected LLM config, reason for selection)
        """
        # Extract task features for model selection
        task_features = self._extract_task_features(task, context)
        
        # Check if we have task-specific history to guide selection
        task_type = task_features.get("task_type", "general")
        task_specific_models = self._get_task_specific_models(task_type)
        
        # Calculate score for each model
        model_scores = []
        for model_conf in self.models_config:
            # Get base score
            score = self._calculate_model_score(model_conf, task_features)
            
            # Apply task-specific adjustments if available
            if model_conf["name"] in task_specific_models:
                task_adjustment = task_specific_models[model_conf["name"]]
                score += task_adjustment * 25  # Boost models that perform well on this task type
            
            # Apply resource constraints
            score = self._apply_resource_constraints(score, model_conf, task_features)
            
            model_scores.append((model_conf, score))
        
        # Sort by score (descending)
        model_scores.sort(key=lambda x: x[1], reverse=True)
        
        # Get the highest scoring model
        selected_model_conf, score = model_scores[0]
        
        # Record model selection for this task type
        self._record_model_selection(task_type, selected_model_conf["name"])
        
        # Create LLMConfig from the selected model
        config = LLMConfig(
            backend=LLMBackendType(selected_model_conf["backend"]),
            model_path=selected_model_conf["model_path"],
            max_tokens=selected_model_conf.get("max_tokens", 2048),
            temperature=self._adjust_temperature(selected_model_conf.get("temperature", 0.7), task_features),
            top_p=selected_model_conf.get("top_p", 0.95),
            top_k=selected_model_conf.get("top_k", 50),
            quantization=selected_model_conf.get("quantization"),
            tensor_parallel_size=selected_model_conf.get("tensor_parallel_size", 1),
            extra_params=selected_model_conf.get("extra_params", {})
        )
        
        # Add task-specific reasoning
        reason = self._generate_selection_reason(selected_model_conf, score, task_features)
        
        # Update model usage statistics
        self._update_model_usage(selected_model_conf["name"])
        
        logger.info(f"Model router selected: {selected_model_conf['name']} (score: {score:.2f})")
        return config, reason
    
    def _extract_task_features(self, task: Task, context: Dict[str, Any]) -> Dict[str, Any]:
        """Extract relevant features from the task for model selection"""
        # Simple feature extraction based on task properties
        query_length = len(task.query)
        tools_count = len(task.tools_allowed) if task.tools_allowed else 0
        has_context = bool(context)
        context_size = len(json.dumps(context)) if context else 0
        
        # Classify task type based on content and tools
        task_type = self._classify_task_type(task.query, task.tools_allowed)
        
        # Estimate task complexity based on features
        if query_length > 500 or tools_count > 5 or context_size > 10000:
            complexity = "high"
        elif query_length > 200 or tools_count > 2 or context_size > 3000:
            complexity = "medium"
        else:
            complexity = "low"
        
        # Determine if task requires specific reasoning
        reasoning_types = self._detect_reasoning_types(task.query)
        
        # Estimate expected response length
        expected_response_length = self._estimate_response_length(task.query)
        
        # Detect if real-time constraints exist
        has_real_time_constraint = "urgent" in task.query.lower() or "immediate" in task.query.lower()
        
        return {
            "complexity": complexity,
            "query_length": query_length,
            "tools_count": tools_count,
            "has_context": has_context,
            "context_size": context_size,
            "agent_type": task.agent_type,
            "task_type": task_type,
            "reasoning_types": reasoning_types,
            "expected_response_length": expected_response_length,
            "has_real_time_constraint": has_real_time_constraint
        }
    
    def _classify_task_type(self, query: str, tools_allowed: Optional[List[str]]) -> str:
        """Classify the task type based on the query and tools"""
        query_lower = query.lower()
        
        # Check for common task types based on keywords
        if "summarize" in query_lower or "summary" in query_lower:
            return "summarization"
        elif "translate" in query_lower:
            return "translation"
        elif "code" in query_lower or "function" in query_lower or "programming" in query_lower:
            return "coding"
        elif "search" in query_lower or "find information" in query_lower:
            return "information_retrieval"
        elif "creative" in query_lower or "write a story" in query_lower or "poem" in query_lower:
            return "creative_writing"
        elif "analyze" in query_lower or "data" in query_lower:
            return "data_analysis"
        
        # Check based on tools if available
        if tools_allowed:
            if "search" in tools_allowed:
                return "information_retrieval"
            elif "calculator" in tools_allowed:
                return "calculation"
            elif "sql" in tools_allowed:
                return "database_query"
        
        # Default to general
        return "general"
    
    def _detect_reasoning_types(self, query: str) -> List[str]:
        """Detect the types of reasoning required for the task"""
        query_lower = query.lower()
        reasoning_types = []
        
        # Detect common reasoning patterns
        if "why" in query_lower or "explain" in query_lower or "reason" in query_lower:
            reasoning_types.append("causal")
        if "compare" in query_lower or "difference between" in query_lower:
            reasoning_types.append("comparative")
        if "step by step" in query_lower or "how to" in query_lower:
            reasoning_types.append("procedural")
        if "predict" in query_lower or "forecast" in query_lower or "future" in query_lower:
            reasoning_types.append("predictive")
        if "ethics" in query_lower or "moral" in query_lower or "should" in query_lower:
            reasoning_types.append("ethical")
        if "creative" in query_lower or "imagine" in query_lower or "generate" in query_lower:
            reasoning_types.append("creative")
        
        # If no specific reasoning detected, assume logical reasoning
        if not reasoning_types:
            reasoning_types.append("logical")
        
        return reasoning_types
    
    def _estimate_response_length(self, query: str) -> str:
        """Estimate the expected response length"""
        query_lower = query.lower()
        word_count = len(query.split())
        
        if "brief" in query_lower or "short" in query_lower or word_count < 10:
            return "short"
        elif "detailed" in query_lower or "comprehensive" in query_lower or word_count > 30:
            return "long"
        else:
            return "medium"
    
    def _calculate_model_score(self, model_conf: Dict[str, Any], 
                              task_features: Dict[str, Any]) -> float:
        """
        Calculate a score for how well a model fits a task.
        Higher score means better fit.
        """
        score = 0.0
        model_name = model_conf["name"]
        
        # Base score from model capabilities
        capabilities = model_conf.get("capabilities", {})
        
        # Match complexity to model capability
        if task_features["complexity"] == "high" and capabilities.get("handles_complex_tasks", False):
            score += 30
        elif task_features["complexity"] == "medium" and capabilities.get("handles_medium_tasks", False):
            score += 20
        elif task_features["complexity"] == "low":
            score += 10
        
        # Consider special capabilities for specific agent types
        if task_features["agent_type"] == "multi_agent" and capabilities.get("multi_agent_coordination", False):
            score += 15
        
        if task_features["agent_type"] == "human_in_loop" and capabilities.get("human_interaction", False):
            score += 15
        
        # Consider reasoning capabilities
        for reasoning_type in task_features.get("reasoning_types", []):
            if capabilities.get(f"{reasoning_type}_reasoning", False):
                score += 10
        
        # Consider response length
        expected_length = task_features.get("expected_response_length", "medium")
        if expected_length == "long" and capabilities.get("handles_long_generation", False):
            score += 15
        elif expected_length == "short" and capabilities.get("efficient_short_responses", False):
            score += 10
        
        # Consider historical performance if available
        if model_name in self.model_metrics:
            metrics = self.model_metrics[model_name]
            
            # Success rate impact (higher is better)
            success_rate = metrics.get("success_rate", 0.5)
            score += success_rate * 20
            
            # Latency impact (lower is better)
            avg_latency = metrics.get("avg_latency", 1000)
            latency_factor = max(0, 1 - (avg_latency / 5000))  # Normalize to 0-1 range
            score += latency_factor * 15
            
            # Accuracy impact (higher is better)
            accuracy = metrics.get("accuracy", 0.5)
            score += accuracy * 25
            
            # Consider token efficiency (higher is better)
            token_efficiency = metrics.get("token_efficiency", 0.5)
            score += token_efficiency * 10
            
            # Real-time constraint considerations
            if task_features.get("has_real_time_constraint", False):
                # Heavily penalize slow models for real-time tasks
                if avg_latency > 3000:  # More than 3 seconds
                    score -= 30
            
        # Consider resource constraints
        resource_efficiency = model_conf.get("resource_efficiency", 0.5)  # 0-1 scale
        score += resource_efficiency * 10
        
        # If model is quantized, it might be more efficient for certain tasks
        if model_conf.get("quantization") and task_features["complexity"] != "high":
            score += 5
        
        # Adjust score for hardware-specific optimizations
        if model_conf.get("backend") == "vLLM" and model_conf.get("tensor_parallel_size", 1) > 1:
            score += 5  # Reward parallelized models for potentially faster inference
        
        return score
    
    def _apply_resource_constraints(self, score: float, model_conf: Dict[str, Any], 
                                  task_features: Dict[str, Any]) -> float:
        """Apply resource constraints to the model score"""
        # Check current system load
        system_load = self._get_system_load()
        
        # If system is under heavy load, favor lightweight models
        if system_load > 0.8:  # 80% load
            resource_efficiency = model_conf.get("resource_efficiency", 0.5)
            score += resource_efficiency * 20  # Heavier weight during high load
            
            # Penalize heavyweight models
            if model_conf.get("backend") == "vLLM" and model_conf.get("tensor_parallel_size", 1) > 1:
                score -= 15
        
        # If task has real-time constraints, prioritize faster models
        if task_features.get("has_real_time_constraint", False):
            # Favor models with known lower latency
            if model_conf["name"] in self.model_metrics:
                avg_latency = self.model_metrics[model_conf["name"]].get("avg_latency", 1000)
                if avg_latency < 500:  # Less than 500ms
                    score += 25
                elif avg_latency < 1000:  # Less than 1s
                    score += 15
        
        return score
    
    def _get_system_load(self) -> float:
        """Get current system load (simplified)"""
        # In a real implementation, this would check actual system metrics
        # For this example, we'll simulate varying load
        return 0.5  # Simulate 50% load
    
    def _get_task_specific_models(self, task_type: str) -> Dict[str, float]:
        """Get task-specific model performance adjustments"""
        if task_type not in self.task_history:
            return {}
        
        # Calculate performance adjustment based on success rate for this task type
        task_models = self.task_history[task_type]
        result = {}
        
        for model_name, stats in task_models.items():
            successes = stats.get("successes", 0)
            total = stats.get("total", 0)
            
            if total > 0:
                success_rate = successes / total
                result[model_name] = success_rate
        
        return result
    
    def _record_model_selection(self, task_type: str, model_name: str):
        """Record that a model was selected for a task type"""
        if task_type not in self.task_history:
            self.task_history[task_type] = {}
        
        if model_name not in self.task_history[task_type]:
            self.task_history[task_type][model_name] = {"total": 0, "successes": 0}
        
        self.task_history[task_type][model_name]["total"] += 1
        self._save_task_history()
    
    def _generate_selection_reason(self, model_conf: Dict[str, Any], score: float, 
                                task_features: Dict[str, Any]) -> str:
        """Generate a detailed reason for the model selection"""
        complexity = task_features.get("complexity", "unknown")
        reasoning_types = task_features.get("reasoning_types", [])
        task_type = task_features.get("task_type", "general")
        
        # Build the reason
        reason_parts = [
            f"Selected {model_conf['name']} based on task complexity ({complexity})",
            f"task type ({task_type})"
        ]
        
        # Add reasoning types if available
        if reasoning_types:
            reason_parts.append(f"required reasoning ({', '.join(reasoning_types)})")
        
        # Add historical performance if available
        if model_conf["name"] in self.model_metrics:
            metrics = self.model_metrics[model_conf["name"]]
            success_rate = metrics.get("success_rate", 0)
            reason_parts.append(f"historical performance (success rate: {success_rate:.2f})")
        
        # Add score
        reason_parts.append(f"overall score: {score:.2f}")
        
        return ", ".join(reason_parts)
    
    def _adjust_temperature(self, base_temperature: float, task_features: Dict[str, Any]) -> float:
        """Dynamically adjust temperature based on task features"""
        adjusted_temp = base_temperature
        
        # Lower temperature for factual/logical tasks
        if "logical" in task_features.get("reasoning_types", []):
            adjusted_temp -= 0.1
        
        # Higher temperature for creative tasks
        if "creative" in task_features.get("reasoning_types", []):
            adjusted_temp += 0.2
        
        # Lower temperature for complex tasks to reduce hallucinations
        if task_features.get("complexity") == "high":
            adjusted_temp -= 0.1
        
        # Ensure temperature stays in valid range
        return max(0.1, min(1.0, adjusted_temp))
    
    def _update_model_usage(self, model_name: str):
        """Update model usage statistics"""
        if model_name not in self.model_usage:
            self.model_usage[model_name] = {
                "count": 0,
                "last_used": None
            }
        
        self.model_usage[model_name]["count"] += 1
        self.model_usage[model_name]["last_used"] = datetime.now().isoformat()
    
    def update_model_metrics(self, model_name: str, metrics: Dict[str, Any]):
        """
        Update performance metrics for a model.
        
        Args:
            model_name: Name of the model
            metrics: Performance metrics (success_rate, latency, accuracy, etc.)
        """
        if model_name not in self.model_metrics:
            self.model_metrics[model_name] = {}
        
        # Update metrics with new values
        current_metrics = self.model_metrics[model_name]
        
        # Handle success_rate as a moving average
        if "success_rate" in metrics:
            new_success = metrics["success_rate"]
            old_success = current_metrics.get("success_rate", 0.5)
            current_metrics["success_rate"] = old_success * 0.9 + new_success * 0.1
        
        # Handle latency as a moving average
        if "avg_latency" in metrics:
            new_latency = metrics["avg_latency"]
            old_latency = current_metrics.get("avg_latency", 1000)
            current_metrics["avg_latency"] = old_latency * 0.9 + new_latency * 0.1
        
        # Handle accuracy as a moving average
        if "accuracy" in metrics:
            new_accuracy = metrics["accuracy"]
            old_accuracy = current_metrics.get("accuracy", 0.5)
            current_metrics["accuracy"] = old_accuracy * 0.9 + new_accuracy * 0.1
        
        # Handle token efficiency
        if "token_efficiency" in metrics:
            new_efficiency = metrics["token_efficiency"]
            old_efficiency = current_metrics.get("token_efficiency", 0.5)
            current_metrics["token_efficiency"] = old_efficiency * 0.9 + new_efficiency * 0.1
        
        # Update other metrics directly
        for key, value in metrics.items():
            if key not in ["success_rate", "avg_latency", "accuracy", "token_efficiency"]:
                current_metrics[key] = value
        
        # Update task-specific success
        if "task_type" in metrics and "success" in metrics:
            task_type = metrics["task_type"]
            success = metrics["success"]
            
            if task_type not in self.task_history:
                self.task_history[task_type] = {}
            
            if model_name not in self.task_history[task_type]:
                self.task_history[task_type][model_name] = {"total": 0, "successes": 0}
            
            self.task_history[task_type][model_name]["total"] += 1
            if success:
                self.task_history[task_type][model_name]["successes"] += 1
            
            self._save_task_history()
        
        # Save updated metrics
        self._save_model_metrics()
        logger.info(f"Updated metrics for model: {model_name}")
    
    def get_model_metrics(self, model_name: Optional[str] = None) -> Dict[str, Any]:
        """
        Get metrics for a specific model or all models.
        
        Args:
            model_name: Optional name of the model to get metrics for
            
        Returns:
            Dictionary of model metrics
        """
        if model_name:
            return self.model_metrics.get(model_name, {})
        else:
            return self.model_metrics
    
    def get_task_metrics(self, task_type: Optional[str] = None) -> Dict[str, Any]:
        """
        Get metrics for a specific task type or all tasks.
        
        Args:
            task_type: Optional task type to get metrics for
            
        Returns:
            Dictionary of task metrics
        """
        if task_type:
            return self.task_history.get(task_type, {})
        else:
            return self.task_history
    
    def evaluate_models(self):
        """Periodically evaluate models and update configurations"""
        # Check if it's time to evaluate (e.g., once per day)
        now = datetime.now()
        time_since_last = (now - self.last_evaluation).total_seconds()
        
        if time_since_last < 86400:  # Less than 24 hours
            return
        
        logger.info("Conducting periodic model evaluation")
        
        # Identify underperforming models
        underperforming = []
        for model_name, metrics in self.model_metrics.items():
            if metrics.get("success_rate", 0) < 0.3:  # Arbitrary threshold
                underperforming.append(model_name)
        
        # Update configurations for underperforming models
        for model_name in underperforming:
            for i, model_conf in enumerate(self.models_config):
                if model_conf["name"] == model_name:
                    # Adjust parameters to improve performance
                    if "temperature" in model_conf:
                        model_conf["temperature"] = 0.5  # Reset to middle value
                    
                    # Log the change
                    logger.info(f"Updated configuration for underperforming model: {model_name}")
        
        # Reset evaluation timer
        self.last_evaluation = now 