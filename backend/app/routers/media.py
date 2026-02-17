from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.media import Media
from app.models.user import User
from app.schemas.media import MediaResponse
from app.services.auth import get_current_admin_user
from app.services.media import save_upload_file, delete_upload_file

router = APIRouter(prefix="/api/admin/media", tags=["media"])


@router.get("", response_model=list[MediaResponse])
def list_media(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    media = (
        db.query(Media)
        .order_by(Media.uploaded_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return media


@router.post("/upload", response_model=MediaResponse, status_code=status.HTTP_201_CREATED)
async def upload_media(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    file_data = await save_upload_file(file)
    media = Media(**file_data)
    db.add(media)
    db.commit()
    db.refresh(media)
    return media


@router.delete("/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_media(
    media_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    media = db.query(Media).filter(Media.id == media_id).first()
    if not media:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Media not found")

    delete_upload_file(media.file_path)
    db.delete(media)
    db.commit()
