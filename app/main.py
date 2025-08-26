# File: app/main.py

from fastapi import FastAPI
from contextlib import asynccontextmanager
from .db.session import init_db
from .routers import auth, notes

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    print("Database connection established.")
    yield
    print("Closing database connection.")

app = FastAPI(
    title="Notes API with MongoDB",
    lifespan=lifespan
)

app.include_router(auth.router)
app.include_router(notes.router)

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the Notes API!"}