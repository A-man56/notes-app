from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class NoteCreate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class NoteOut(BaseModel):
    id: int
    title: Optional[str]
    content: Optional[str]
    version: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
