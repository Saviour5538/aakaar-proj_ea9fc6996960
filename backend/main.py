import os
from datetime import datetime
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from contextlib import asynccontextmanager
from database.config import get_db, Base
from backend.routes.documents import router as documents_router

# FastAPI application setup
app = FastAPI(
    title="PaperPalLite",
    description="AI-powered document ingestion and query system",
    version="1.0.0",
)

# CORS middleware setup
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lifespan context manager for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    try:
        # Initialize the database
        async with get_db() as db:
            async with db.begin():
                Base.metadata.create_all(bind=db.get_bind())
        yield
    finally:
        # Shutdown logic
        pass

app.router.lifespan_context = lifespan

# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

# Global exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred."},
    )

# Include routers
app.include_router(documents_router, prefix="/api")