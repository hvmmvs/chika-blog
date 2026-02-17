from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.post import Post, PostStatus
from app.models.post_view import PostView
from app.models.user import User
from app.schemas.post import PostCreate, PostUpdate, PostResponse, PostListResponse
from app.services.auth import get_current_admin_user
from app.utils.sanitize import sanitize_html

router = APIRouter(prefix="/api", tags=["posts"])


# Public endpoints
@router.get("/posts", response_model=list[PostListResponse])
def list_published_posts(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    posts = (
        db.query(Post)
        .filter(Post.status == PostStatus.PUBLISHED)
        .order_by(Post.published_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return posts


@router.post("/posts/{slug}/view", status_code=status.HTTP_204_NO_CONTENT)
def track_post_view(slug: str, request: Request, db: Session = Depends(get_db)):
    post = (
        db.query(Post)
        .filter(Post.slug == slug, Post.status == PostStatus.PUBLISHED)
        .first()
    )
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    forwarded_for = request.headers.get("X-Forwarded-For")
    ip_address = forwarded_for.split(",")[0].strip() if forwarded_for else (request.client.host if request.client else "unknown")

    view = PostView(post_id=post.id, ip_address=ip_address)
    db.add(view)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/posts/{slug}", response_model=PostResponse)
def get_post_by_slug(slug: str, db: Session = Depends(get_db)):
    post = (
        db.query(Post)
        .filter(Post.slug == slug, Post.status == PostStatus.PUBLISHED)
        .first()
    )
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return post


# Admin endpoints
@router.get("/admin/posts/{post_id}", response_model=PostResponse)
def get_admin_post(
    post_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return post


@router.get("/admin/posts", response_model=list[PostListResponse])
def list_all_posts(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    view_count_sq = (
        db.query(
            PostView.post_id,
            func.count(PostView.id).label("view_count"),
            func.count(func.distinct(PostView.ip_address)).label("unique_view_count"),
        )
        .group_by(PostView.post_id)
        .subquery()
    )

    rows = (
        db.query(
            Post,
            func.coalesce(view_count_sq.c.view_count, 0).label("view_count"),
            func.coalesce(view_count_sq.c.unique_view_count, 0).label("unique_view_count"),
        )
        .outerjoin(view_count_sq, Post.id == view_count_sq.c.post_id)
        .order_by(Post.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    results = []
    for post, view_count, unique_view_count in rows:
        post_dict = PostListResponse.model_validate(post).model_dump()
        post_dict["view_count"] = view_count
        post_dict["unique_view_count"] = unique_view_count
        results.append(post_dict)
    return results


@router.post("/admin/posts", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    post_data: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    existing = db.query(Post).filter(Post.slug == post_data.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Post with this slug already exists",
        )

    data = post_data.model_dump()
    if data.get("content"):
        data["content"] = sanitize_html(data["content"])
    if data.get("content_ja"):
        data["content_ja"] = sanitize_html(data["content_ja"])
    post = Post(**data)
    if post.status == PostStatus.PUBLISHED:
        post.published_at = datetime.utcnow()

    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.put("/admin/posts/{post_id}", response_model=PostResponse)
def update_post(
    post_id: UUID,
    post_data: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    update_data = post_data.model_dump(exclude_unset=True)

    if "content" in update_data and update_data["content"]:
        update_data["content"] = sanitize_html(update_data["content"])
    if "content_ja" in update_data and update_data["content_ja"]:
        update_data["content_ja"] = sanitize_html(update_data["content_ja"])

    if "status" in update_data:
        if update_data["status"] == PostStatus.PUBLISHED and post.status != PostStatus.PUBLISHED:
            post.published_at = datetime.utcnow()

    for field, value in update_data.items():
        setattr(post, field, value)

    db.commit()
    db.refresh(post)
    return post


@router.delete("/admin/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    db.delete(post)
    db.commit()
