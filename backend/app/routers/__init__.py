from app.routers.auth import router as auth_router
from app.routers.posts import router as posts_router
from app.routers.categories import router as categories_router
from app.routers.media import router as media_router
from app.routers.seo import router as seo_router

__all__ = ["auth_router", "posts_router", "categories_router", "media_router", "seo_router"]
