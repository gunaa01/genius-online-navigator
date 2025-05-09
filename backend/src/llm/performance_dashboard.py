"""
Performance dashboard for the AgentForge OSS framework.
This module provides visualization and analysis of model performance metrics.
"""

import logging
import json
import os
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)

class PerformanceDashboard:
    """Dashboard for visualizing and analyzing model performance"""
    
    def __init__(self, output_dir: str = "./performance_reports"):
        """
        Initialize the performance dashboard.
        
        Args:
            output_dir: Directory to save generated reports
        """
        self.output_dir = output_dir
        self._ensure_output_dir()
    
    def _ensure_output_dir(self):
        """Ensure the output directory exists"""
        try:
            os.makedirs(self.output_dir, exist_ok=True)
            logger.info(f"Performance dashboard output directory: {self.output_dir}")
        except Exception as e:
            logger.error(f"Failed to create output directory: {e}")
    
    def generate_report(self, model_router, time_period: str = "day") -> str:
        """
        Generate a performance report.
        
        Args:
            model_router: The model router instance with metrics
            time_period: Time period for the report ("day", "week", "month")
            
        Returns:
            Path to the generated report
        """
        try:
            # Get model metrics from the router
            model_metrics = model_router.get_model_metrics()
            task_metrics = model_router.get_task_metrics()
            
            # Create a timestamp for the report
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            report_path = os.path.join(self.output_dir, f"performance_report_{timestamp}")
            os.makedirs(report_path, exist_ok=True)
            
            # Generate visualizations
            self._generate_model_comparison(model_metrics, report_path)
            self._generate_task_performance(task_metrics, report_path)
            self._generate_latency_analysis(model_metrics, report_path)
            
            # Generate summary report
            summary_path = self._generate_summary(model_metrics, task_metrics, report_path)
            
            logger.info(f"Generated performance report at: {report_path}")
            return summary_path
            
        except Exception as e:
            logger.error(f"Error generating performance report: {e}")
            return None
    
    def _generate_model_comparison(self, model_metrics: Dict[str, Any], report_path: str):
        """Generate model comparison visualization"""
        try:
            # Extract key metrics for comparison
            models = []
            success_rates = []
            latencies = []
            
            for model_name, metrics in model_metrics.items():
                models.append(model_name)
                success_rates.append(metrics.get("success_rate", 0))
                latencies.append(metrics.get("avg_latency", 0))
            
            # Create figure with two subplots
            fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 6))
            
            # Success rate bar chart
            ax1.bar(models, success_rates, color='green')
            ax1.set_title('Model Success Rates')
            ax1.set_xlabel('Model')
            ax1.set_ylabel('Success Rate')
            ax1.set_ylim(0, 1)
            plt.setp(ax1.get_xticklabels(), rotation=45, ha='right')
            
            # Latency bar chart
            ax2.bar(models, latencies, color='blue')
            ax2.set_title('Model Average Latencies (ms)')
            ax2.set_xlabel('Model')
            ax2.set_ylabel('Latency (ms)')
            plt.setp(ax2.get_xticklabels(), rotation=45, ha='right')
            
            plt.tight_layout()
            
            # Save the figure
            comparison_path = os.path.join(report_path, "model_comparison.png")
            plt.savefig(comparison_path)
            plt.close()
            
            logger.debug(f"Generated model comparison visualization: {comparison_path}")
            
        except Exception as e:
            logger.error(f"Error generating model comparison: {e}")
    
    def _generate_task_performance(self, task_metrics: Dict[str, Any], report_path: str):
        """Generate task performance visualization"""
        try:
            # Prepare data for visualization
            task_types = []
            model_names = set()
            success_data = {}
            
            # Collect all task types and models
            for task_type, models in task_metrics.items():
                task_types.append(task_type)
                for model_name, stats in models.items():
                    model_names.add(model_name)
                    if model_name not in success_data:
                        success_data[model_name] = {}
                    
                    # Calculate success rate
                    total = stats.get("total", 0)
                    successes = stats.get("successes", 0)
                    success_rate = successes / total if total > 0 else 0
                    success_data[model_name][task_type] = success_rate
            
            # Sort task types for consistency
            task_types.sort()
            model_names = sorted(model_names)
            
            # Create a figure
            fig, ax = plt.subplots(figsize=(12, 8))
            
            # Set the width of bars
            bar_width = 0.8 / len(model_names)
            
            # Set position of bars on x axis
            indices = np.arange(len(task_types))
            
            # Plot bars for each model
            for i, model_name in enumerate(model_names):
                model_success_rates = [success_data[model_name].get(task, 0) for task in task_types]
                position = indices + i * bar_width
                ax.bar(position, model_success_rates, bar_width, label=model_name)
            
            # Add labels and legend
            ax.set_title('Model Success Rates by Task Type')
            ax.set_xlabel('Task Type')
            ax.set_ylabel('Success Rate')
            ax.set_xticks(indices + bar_width * (len(model_names) - 1) / 2)
            ax.set_xticklabels(task_types, rotation=45, ha='right')
            ax.set_ylim(0, 1)
            ax.legend()
            
            plt.tight_layout()
            
            # Save the figure
            task_path = os.path.join(report_path, "task_performance.png")
            plt.savefig(task_path)
            plt.close()
            
            logger.debug(f"Generated task performance visualization: {task_path}")
            
        except Exception as e:
            logger.error(f"Error generating task performance visualization: {e}")
    
    def _generate_latency_analysis(self, model_metrics: Dict[str, Any], report_path: str):
        """Generate latency analysis visualization"""
        try:
            # Extract latency data
            models = []
            latencies = []
            
            for model_name, metrics in model_metrics.items():
                models.append(model_name)
                latencies.append(metrics.get("avg_latency", 0))
            
            # Create figure
            fig, ax = plt.subplots(figsize=(10, 6))
            
            # Create horizontal bar chart
            ax.barh(models, latencies, color='purple')
            ax.set_title('Model Latency Comparison')
            ax.set_xlabel('Average Latency (ms)')
            ax.set_ylabel('Model')
            
            # Add latency values as text
            for i, v in enumerate(latencies):
                ax.text(v + 10, i, f"{v:.1f} ms", va='center')
            
            plt.tight_layout()
            
            # Save the figure
            latency_path = os.path.join(report_path, "latency_analysis.png")
            plt.savefig(latency_path)
            plt.close()
            
            logger.debug(f"Generated latency analysis visualization: {latency_path}")
            
        except Exception as e:
            logger.error(f"Error generating latency analysis: {e}")
    
    def _generate_summary(self, model_metrics: Dict[str, Any], 
                         task_metrics: Dict[str, Any], report_path: str) -> str:
        """
        Generate a summary report.
        
        Returns:
            Path to the summary report
        """
        try:
            # Create summary path
            summary_path = os.path.join(report_path, "summary_report.html")
            
            # Prepare summary data
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            # Find best performing model overall
            best_model = None
            best_success_rate = -1
            
            for model_name, metrics in model_metrics.items():
                success_rate = metrics.get("success_rate", 0)
                if success_rate > best_success_rate:
                    best_success_rate = success_rate
                    best_model = model_name
            
            # Find best model for each task type
            best_models_by_task = {}
            
            for task_type, models in task_metrics.items():
                task_best_model = None
                task_best_rate = -1
                
                for model_name, stats in models.items():
                    total = stats.get("total", 0)
                    successes = stats.get("successes", 0)
                    
                    if total > 0:
                        success_rate = successes / total
                        if success_rate > task_best_rate:
                            task_best_rate = success_rate
                            task_best_model = model_name
                
                if task_best_model:
                    best_models_by_task[task_type] = {
                        "model": task_best_model,
                        "success_rate": task_best_rate
                    }
            
            # Generate HTML report
            html_content = f"""<!DOCTYPE html>
            <html>
            <head>
                <title>AgentForge Performance Report</title>
                <style>
                    body {{ font-family: Arial, sans-serif; margin: 20px; }}
                    h1, h2, h3 {{ color: #333; }}
                    table {{ border-collapse: collapse; width: 100%; margin-bottom: 20px; }}
                    th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
                    th {{ background-color: #f2f2f2; }}
                    tr:nth-child(even) {{ background-color: #f9f9f9; }}
                    .metric-good {{ color: green; }}
                    .metric-bad {{ color: red; }}
                    .section {{ margin-bottom: 30px; }}
                    img {{ max-width: 100%; height: auto; }}
                </style>
            </head>
            <body>
                <h1>AgentForge Performance Report</h1>
                <p>Generated on: {timestamp}</p>
                
                <div class="section">
                    <h2>Summary</h2>
                    <p><strong>Best Performing Model Overall:</strong> {best_model} (Success Rate: {best_success_rate:.2f})</p>
                    
                    <h3>Best Models by Task Type</h3>
                    <table>
                        <tr>
                            <th>Task Type</th>
                            <th>Best Model</th>
                            <th>Success Rate</th>
                        </tr>
            """
            
            # Add rows for task-specific best models
            for task_type, data in best_models_by_task.items():
                html_content += f"""
                        <tr>
                            <td>{task_type}</td>
                            <td>{data["model"]}</td>
                            <td>{data["success_rate"]:.2f}</td>
                        </tr>
                """
            
            html_content += """
                    </table>
                </div>
                
                <div class="section">
                    <h2>Model Performance Comparison</h2>
                    <img src="model_comparison.png" alt="Model Comparison Chart">
                </div>
                
                <div class="section">
                    <h2>Task Performance by Model</h2>
                    <img src="task_performance.png" alt="Task Performance Chart">
                </div>
                
                <div class="section">
                    <h2>Latency Analysis</h2>
                    <img src="latency_analysis.png" alt="Latency Analysis Chart">
                </div>
                
                <div class="section">
                    <h2>Detailed Model Metrics</h2>
                    <table>
                        <tr>
                            <th>Model</th>
                            <th>Success Rate</th>
                            <th>Avg Latency (ms)</th>
                            <th>Token Efficiency</th>
                            <th>Last Used</th>
                        </tr>
            """
            
            # Add rows for each model
            for model_name, metrics in model_metrics.items():
                success_rate = metrics.get("success_rate", 0)
                avg_latency = metrics.get("avg_latency", 0)
                token_efficiency = metrics.get("token_efficiency", "N/A")
                last_used = metrics.get("last_used", "Never")
                
                # Format last_used if it's a timestamp
                if isinstance(last_used, (int, float)):
                    last_used = datetime.fromtimestamp(last_used).strftime("%Y-%m-%d %H:%M:%S")
                
                html_content += f"""
                        <tr>
                            <td>{model_name}</td>
                            <td class="{'metric-good' if success_rate > 0.7 else 'metric-bad'}">{success_rate:.2f}</td>
                            <td class="{'metric-good' if avg_latency < 1000 else 'metric-bad'}">{avg_latency:.1f}</td>
                            <td>{token_efficiency if isinstance(token_efficiency, str) else f"{token_efficiency:.2f}"}</td>
                            <td>{last_used}</td>
                        </tr>
                """
            
            html_content += """
                    </table>
                </div>
                
                <div class="section">
                    <h2>Recommendations</h2>
                    <ul>
            """
            
            # Generate recommendations based on metrics
            recommendations = []
            
            # Check for consistently low-performing models
            for model_name, metrics in model_metrics.items():
                if metrics.get("success_rate", 0) < 0.3 and metrics.get("avg_latency", 0) > 2000:
                    recommendations.append(f"Consider removing or replacing model '{model_name}' due to poor performance.")
            
            # Suggest task-specific model assignments
            for task_type, data in best_models_by_task.items():
                if data["success_rate"] > 0.8:
                    recommendations.append(f"Prioritize model '{data['model']}' for '{task_type}' tasks (success rate: {data['success_rate']:.2f}).")
            
            # Add general recommendations if no specific ones
            if not recommendations:
                recommendations.append("All models are performing within acceptable parameters.")
                recommendations.append("Consider adding more diverse models to handle specialized tasks.")
            
            # Add recommendations to HTML
            for recommendation in recommendations:
                html_content += f"<li>{recommendation}</li>\n"
            
            html_content += """
                    </ul>
                </div>
            </body>
            </html>
            """
            
            # Write HTML to file
            with open(summary_path, "w") as f:
                f.write(html_content)
            
            logger.info(f"Generated summary report: {summary_path}")
            return summary_path
            
        except Exception as e:
            logger.error(f"Error generating summary report: {e}")
            return None

def generate_performance_report(model_router) -> str:
    """
    Generate a performance report using the current model router.
    
    Args:
        model_router: The model router instance
        
    Returns:
        Path to the generated report
    """
    dashboard = PerformanceDashboard()
    return dashboard.generate_report(model_router) 