from uuid import UUID
from pydantic import BaseModel


class CategoryCreate(BaseModel):
    name: str
    slug: str
    description: str | None = None


class CategoryUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None


class CategoryResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    description: str | None

    class Config:
        from_attributes = True
