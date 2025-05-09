"""
API endpoints for the Model Router.
This module provides REST API access to model router functionality.
"""

import logging
from typing import Dict, List, Any, Optional
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, Query

from ..llm import get_model_router
from ..llm.performance_dashboard import generate_performance_report

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/models",
    tags=["model-router"],
    responses={404: {"description": "Not found"}},
)

# Dependency to get the model router
def get_router():
    """Get the model router instance"""
    return get_model_router()

@router.get("/metrics")
async def get_model_metrics(model_name: Optional[str] = None, router=Depends(get_router)):
    """
    Get performance metrics for models.
    
    Args:
        model_name: Optional name of a specific model to get metrics for
    
    Returns:
        Dictionary of model metrics
    """
    try:
        return router.get_model_metrics(model_name)
    except Exception as e:
        logger.error(f"Error getting model metrics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/task-metrics")
async def get_task_metrics(task_type: Optional[str] = None, router=Depends(get_router)):
    """
    Get performance metrics for task types.
    
    Args:
        task_type: Optional specific task type to get metrics for
    
    Returns:
        Dictionary of task metrics
    """
    try:
        return router.get_task_metrics(task_type)
    except Exception as e:
        logger.error(f"Error getting task metrics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/config")
async def get_model_configs(router=Depends(get_router)):
    """
    Get the current model configurations.
    
    Returns:
        List of model configurations
    """
    try:
        return router.models_config
    except Exception as e:
        logger.error(f"Error getting model configurations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-report")
async def create_performance_report(
    background_tasks: BackgroundTasks,
    time_period: str = Query("day", enum=["day", "week", "month"]),
    router=Depends(get_router)
):
    """
    Generate a performance report.
    
    Args:
        time_period: Time period for the report ("day", "week", "month")
    
    Returns:
        Path to the generated report
    """
    try:
        # Start report generation in the background
        background_tasks.add_task(generate_performance_report, router)
        
        return {
            "status": "Report generation started",
            "message": "The report will be available in the performance_reports directory"
        }
    except Exception as e:
        logger.error(f"Error starting report generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/update-model-metrics")
async def update_model_metrics(
    model_name: str,
    metrics: Dict[str, Any],
    router=Depends(get_router)
):
    """
    Manually update metrics for a model.
    
    Args:
        model_name: Name of the model
        metrics: Performance metrics to update
    
    Returns:
        Success message
    """
    try:
        router.update_model_metrics(model_name, metrics)
        return {"status": "success", "message": f"Updated metrics for model: {model_name}"}
    except Exception as e:
        logger.error(f"Error updating model metrics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/evaluate-models")
async def trigger_model_evaluation(router=Depends(get_router)):
    """
    Trigger evaluation of models.
    
    Returns:
        Success message
    """
    try:
        router.evaluate_models()
        return {"status": "success", "message": "Model evaluation triggered"}
    except Exception as e:
        logger.error(f"Error evaluating models: {e}")
        raise HTTPException(status_code=500, detail=str(e)) 