"""
Workflow Templates for Genius Navigator

This package contains workflow templates for various tasks.
"""

from typing import Dict, List, Any
import os
import logging
import importlib
import inspect

logger = logging.getLogger(__name__)

# Dictionary to store available templates
AVAILABLE_TEMPLATES: Dict[str, Any] = {}

def register_template(name: str, func: Any) -> None:
    """Register a template creation function"""
    AVAILABLE_TEMPLATES[name] = func
    logger.info(f"Registered workflow template: {name}")

def get_template_creators() -> Dict[str, Any]:
    """Get all available template creators"""
    return AVAILABLE_TEMPLATES.copy()

def _load_all_templates() -> None:
    """Load all template modules in this directory"""
    # Get the current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Get all Python files in this directory
    template_files = [
        f for f in os.listdir(current_dir)
        if f.endswith('.py') and f != '__init__.py'
    ]
    
    # Import each module
    for template_file in template_files:
        module_name = template_file[:-3]  # Remove .py extension
        try:
            module = importlib.import_module(f".{module_name}", package=__name__)
            
            # Look for create_*_workflow_template functions
            for name, func in inspect.getmembers(module, inspect.isfunction):
                if name.startswith('create_') and name.endswith('_workflow_template'):
                    # Register the template creator
                    template_name = name[7:-17]  # Extract name between create_ and _workflow_template
                    register_template(template_name, func)
        
        except Exception as e:
            logger.error(f"Error loading template module {module_name}: {e}")

# Load all templates when this module is imported
_load_all_templates() 