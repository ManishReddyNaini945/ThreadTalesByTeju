from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime


class CommentCreate(BaseModel):
    product_id: int
    message: str

    @field_validator("message")
    @classmethod
    def not_blank(cls, v):
        v = v.strip()
        if not v:
            raise ValueError("Comment cannot be empty")
        return v


class CommentOut(BaseModel):
    id: int
    product_id: int
    message: str
    admin_reply: Optional[str] = None
    admin_reply_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    user_name: Optional[str] = None

    class Config:
        from_attributes = True


class CommentAdminOut(CommentOut):
    product_name: Optional[str] = None
    user_email: Optional[str] = None


class CommentReply(BaseModel):
    admin_reply: str

    @field_validator("admin_reply")
    @classmethod
    def not_blank(cls, v):
        v = v.strip()
        if not v:
            raise ValueError("Reply cannot be empty")
        return v
