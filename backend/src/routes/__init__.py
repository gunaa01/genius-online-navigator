"""
API Routes for Genius Navigator Backend

This module initializes and provides all API routes for the backend.
"""

from fastapi import FastAPI

from .workflows.api import setup_workflow_routes


def setup_routes(app: FastAPI) -> None:
    """Set up all API routes for the application"""
    # Set up workflow routes
    setup_workflow_routes(app) 