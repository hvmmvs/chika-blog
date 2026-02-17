import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class PostView(Base):
    __tablename__ = "post_views"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    post_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("posts.id", ondelete="CASCADE"), index=True
    )
    ip_address: Mapped[str] = mapped_column(String(45))
    viewed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
