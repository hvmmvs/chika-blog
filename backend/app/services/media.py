import os
import uuid
from pathlib import Path

from fastapi import UploadFile

from app.config import get_settings

settings = get_settings()


def get_upload_path() -> Path:
    upload_path = Path(settings.upload_dir)
    upload_path.mkdir(parents=True, exist_ok=True)
    return upload_path


async def save_upload_file(file: UploadFile) -> dict:
    upload_path = get_upload_path()

    ext = Path(file.filename).suffix if file.filename else ""
    filename = f"{uuid.uuid4()}{ext}"
    file_path = upload_path / filename

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    return {
        "filename": filename,
        "original_name": file.filename or "unknown",
        "file_path": str(file_path),
        "mime_type": file.content_type or "application/octet-stream",
        "size_bytes": len(content),
    }


def delete_upload_file(file_path: str) -> bool:
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        return False
    except OSError:
        return False
