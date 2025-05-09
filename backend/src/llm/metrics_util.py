"""
Metrics utilities for the AgentForge OSS framework.
This module provides functions for measuring model performance.
"""

import time
import logging
from typing import Dict, Any, Callable, Optional, Tuple

logger = logging.getLogger(__name__)

class ModelMetricsCollector:
    """Utility class for collecting model performance metrics"""
    
    def __init__(self):
        """Initialize the metrics collector"""
        self.reset()
    
    def reset(self):
        """Reset all metrics"""
        self.start_time = None
        self.end_time = None
        self.tokens_in = 0
        self.tokens_out = 0
        self.successes = 0
        self.failures = 0
        self.total_latency = 0
        self.call_count = 0
    
    def start_measurement(self):
        """Start a performance measurement"""
        self.start_time = time.time()
    
    def end_measurement(self, success: bool = True, tokens_in: int = 0, tokens_out: int = 0):
        """
        End a performance measurement and record metrics.
        
        Args:
            success: Whether the operation was successful
            tokens_in: Number of input tokens
            tokens_out: Number of output tokens
        """
        if self.start_time is None:
            logger.warning("Ending measurement that was never started")
            return
        
        self.end_time = time.time()
        latency = (self.end_time - self.start_time) * 1000  # ms
        
        # Update metrics
        self.total_latency += latency
        self.call_count += 1
        self.tokens_in += tokens_in
        self.tokens_out += tokens_out
        
        if success:
            self.successes += 1
        else:
            self.failures += 1
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get the collected metrics"""
        metrics = {}
        
        # Calculate average latency
        if self.call_count > 0:
            metrics["avg_latency"] = self.total_latency / self.call_count
        
        # Calculate success rate
        total_calls = self.successes + self.failures
        if total_calls > 0:
            metrics["success_rate"] = self.successes / total_calls
        
        # Calculate token efficiency
        if self.tokens_in > 0 and self.tokens_out > 0:
            # Higher is better - represents output tokens per input token
            metrics["token_efficiency"] = self.tokens_out / self.tokens_in
        
        return metrics

def measure_execution(func: Callable) -> Callable:
    """
    Decorator for measuring function execution performance.
    
    Args:
        func: The function to measure
        
    Returns:
        Wrapped function with performance measurement
    """
    async def wrapper(*args, **kwargs):
        # Create metrics collector
        collector = ModelMetricsCollector()
        collector.start_measurement()
        
        try:
            # Call the function
            result = await func(*args, **kwargs)
            
            # Estimate token counts from result (simplified)
            tokens_in = len(str(args)) + len(str(kwargs)) if args or kwargs else 0
            tokens_out = len(str(result)) if result else 0
            
            # End measurement with success
            collector.end_measurement(success=True, tokens_in=tokens_in, tokens_out=tokens_out)
            
            # Add metrics to the result if it's a dict
            if isinstance(result, dict):
                result["_metrics"] = collector.get_metrics()
            
            return result
            
        except Exception as e:
            # End measurement with failure
            collector.end_measurement(success=False)
            
            # Re-raise the exception
            raise
    
    return wrapper

def estimate_tokens(text: str, model_name: Optional[str] = None) -> int:
    """
    Estimate the number of tokens in a text string.
    This is a simplified implementation that can be replaced with actual tokenizers.
    
    Args:
        text: The text to estimate tokens for
        model_name: Optional model name for model-specific tokenization
        
    Returns:
        Estimated token count
    """
    # Simple estimation based on whitespace and punctuation
    # In production, use the actual tokenizer for the model
    words = text.split()
    punctuation_count = sum(1 for c in text if c in ".,;:!?()[]{}-\"'")
    
    # Rough estimate: each word is ~1.3 tokens, and punctuation is 1 token each
    return int(len(words) * 1.3) + punctuation_count

def calculate_cost_estimate(input_tokens: int, output_tokens: int, 
                          model_name: str) -> Tuple[float, str]:
    """
    Calculate an estimated cost for model usage.
    
    Args:
        input_tokens: Number of input tokens
        output_tokens: Number of output tokens
        model_name: Name of the model used
        
    Returns:
        Tuple of (cost estimate, currency)
    """
    # Simplified cost model, should be replaced with actual pricing
    costs = {
        "gpt-4": (0.03, 0.06),  # (input, output) per 1k tokens in USD
        "gpt-3.5-turbo": (0.0015, 0.002),
        "mistralai/Mixtral-8x7B-Instruct-v0.1": (0.0003, 0.0004),
        "meta-llama/Llama-2-13b-chat-hf": (0.0002, 0.0003),
        "default": (0.0001, 0.0002)
    }
    
    # Get cost rates for the model
    input_rate, output_rate = costs.get(model_name, costs["default"])
    
    # Calculate cost
    input_cost = (input_tokens / 1000) * input_rate
    output_cost = (output_tokens / 1000) * output_rate
    total_cost = input_cost + output_cost
    
    return (total_cost, "USD") 