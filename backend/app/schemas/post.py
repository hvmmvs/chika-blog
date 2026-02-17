from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

from app.models.post import PostStatus
from app.schemas.category import CategoryResponse
from app.schemas.media import MediaResponse


class PostCreate(BaseModel):
    title: str
    slug: str
    content: str | None = None
    excerpt: str | None = None
    title_ja: str | None = None
    content_ja: str | None = None
    excerpt_ja: str | None = None
    featured_image_id: UUID | None = None
    category_id: UUID | None = None
    status: PostStatus = PostStatus.DRAFT


class PostUpdate(BaseModel):
    title: str | None = None
    slug: str | None = None
    content: str | None = None
    excerpt: str | None = None
    title_ja: str | None = None
    content_ja: str | None = None
    excerpt_ja: str | None = None
    featured_image_id: UUID | None = None
    category_id: UUID | None = None
    status: PostStatus | None = None


class PostResponse(BaseModel):
    id: UUID
    title: str
    slug: str
    content: str | None
    excerpt: str | None
    title_ja: str | None
    content_ja: str | None
    excerpt_ja: str | None
    status: PostStatus
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime
    category: CategoryResponse | None
    featured_image: MediaResponse | None

    class Config:
        from_attributes = True


class PostListResponse(BaseModel):
    id: UUID
    title: str
    slug: str
    excerpt: str | None
    title_ja: str | None
    excerpt_ja: str | None
    status: PostStatus
    published_at: datetime | None
    created_at: datetime
    category: CategoryResponse | None
    featured_image: MediaResponse | None
    view_count: int = 0
    unique_view_count: int = 0

    class Config:
        from_attributes = True
