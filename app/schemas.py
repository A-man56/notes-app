# File: app/schemas.py

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class NoteBase(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class NoteCreate(NoteBase):
    pass

class NoteOut(NoteBase):
    id: str = Field(..., alias="_id")
    version: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True 
        json_encoders = {
           
        }