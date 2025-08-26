# File: app/models.py

from beanie import Document, Indexed
from pydantic import Field
from typing import Optional
from datetime import datetime
import pymongo

class User(Document):
    username: Indexed(str, unique=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users" # MongoDB collection name

class Note(Document):
    user_id: Indexed(str)
    title: Optional[str] = None
    content: Optional[str] = None
    version: int = 1
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "notes"
        indexes = [
            [
                ("user_id", pymongo.ASCENDING),
                ("created_at", pymongo.DESCENDING),
            ]
        ]