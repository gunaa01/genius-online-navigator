"""
Main Application Module for Genius Navigator

This module initializes and starts the FastAPI application for the Genius Navigator backend,
including all routes, middleware, and dependencies.
"""

import os
import logging
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Import routes
from .routes import setup_routes

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create data directories
def setup_data_directories():
    """Set up data directories for the application"""
    data_dirs = [
        "data",
        "data/workflows",
        "data/models",
        "data/embeddings",
        "data/logs",
    ]
    
    for directory in data_dirs:
        Path(directory).mkdir(parents=True, exist_ok=True)


# Create FastAPI app
app = FastAPI(
    title="Genius Navigator Agentic AI Backend",
    description="Backend API for Genius Navigator, providing agentic AI capabilities",
    version="1.0.0",
)


# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Set up routes
setup_routes(app)


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Genius Navigator Agentic AI Backend",
        "version": "1.0.0",
        "docs": "/docs",
    }


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


# Error handling
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions"""
    return {
        "error": exc.detail,
        "status_code": exc.status_code,
    }


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return {
        "error": "Internal server error",
        "status_code": 500,
        "detail": str(exc) if os.getenv("DEBUG", "false").lower() == "true" else None,
    }


# Startup and shutdown events
@app.on_event("startup")
async def startup_event():
    """Run startup tasks"""
    # Set up data directories
    setup_data_directories()
    
    logger.info("Application started successfully")


@app.on_event("shutdown")
async def shutdown_event():
    """Run shutdown tasks"""
    logger.info("Application shutting down")


# Run the application
if __name__ == "__main__":
    import uvicorn
    
    # Run the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )