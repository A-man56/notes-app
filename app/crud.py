
from .models import User, Note
from .schemas import NoteCreate
from datetime import datetime
async def create_user(username: str, password_hash: str) -> User:
    user = User(username=username, password_hash=password_hash)
    await user.insert()
    return user

async def get_user_by_username(username: str) -> User | None:
    return await User.find_one(User.username == username)

async def create_note(user_id: str, payload: NoteCreate) -> Note:
    note = Note(user_id=user_id, title=payload.title, content=payload.content)
    await note.insert()
    return note

async def get_notes_for_user(user_id: str) -> list[Note]:
    return await Note.find(Note.user_id == user_id).sort(-Note.created_at).to_list()

async def get_note_by_id(note_id: str, user_id: str) -> Note | None:
    return await Note.find_one(Note.id == note_id, Note.user_id == user_id)

async def update_note_with_version(
    note_id: str, user_id: str, title: str, content: str, client_version: int
) -> Note | None:
    
    note_to_update = await Note.find_one(
        Note.id == note_id,
        Note.user_id == user_id,
        Note.version == client_version
    )

    if not note_to_update:
        return None

    note_to_update.title = title
    note_to_update.content = content
    note_to_update.version += 1
    note_to_update.updated_at = datetime.utcnow()
    
    await note_to_update.save()
    return note_to_update

async def delete_note(note_id: str, user_id: str) -> bool:
    note = await get_note_by_id(note_id, user_id)
    if note:
        await note.delete()
        return True
    return False