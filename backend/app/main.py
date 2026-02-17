from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import get_settings
from app.routers import auth_router, posts_router, categories_router, media_router, seo_router

settings = get_settings()

app = FastAPI(
    title="Chika Blog API",
    description="API for the Chika Blog platform",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

app.include_router(auth_router)
app.include_router(posts_router)
app.include_router(categories_router)
app.include_router(media_router)
app.include_router(seo_router)


@app.get("/")
def root():
    return {"message": "Welcome to Chika Blog API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
