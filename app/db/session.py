# File: app/db/session.py

import motor.motor_asyncio
from beanie import init_beanie
from ..core.config import settings
from ..models import User, Note # Import your Beanie models

async def init_db():
    """
    Initializes the database connection and Beanie ODM.
    """
    client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URL)
    await init_beanie(
        database=client.get_default_database(), 
        document_models=[User, Note]
    )