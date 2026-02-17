from uuid import UUID
from datetime import datetime
from pydantic import BaseModel


class MediaResponse(BaseModel):
    id: UUID
    filename: str
    original_name: str
    file_path: str
    mime_type: str
    size_bytes: int
    uploaded_at: datetime

    class Config:
        from_attributes = True
