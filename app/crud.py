from sqlalchemy import select, insert, update, delete, func
from .models import User, Note

async def create_user(db, username, password_hash):
    u = User(username=username, password_hash=password_hash)
    db.add(u)
    await db.commit()
    await db.refresh(u)
    return u

async def get_user_by_username(db, username):
    q = select(User).where(User.username == username)
    res = await db.execute(q)
    return res.scalars().first()

async def create_note(db, user_id, title, content):
    n = Note(user_id=user_id, title=title, content=content)
    db.add(n)
    await db.commit()
    await db.refresh(n)
    return n

async def get_notes_for_user(db, user_id):
    q = select(Note).where(Note.user_id == user_id).order_by(Note.created_at.desc())
    res = await db.execute(q)
    return res.scalars().all()

async def get_note_by_id(db, note_id, user_id):
    q = select(Note).where(Note.id == note_id, Note.user_id == user_id)
    res = await db.execute(q)
    return res.scalars().first()

async def update_note_with_version(db, note_id, user_id, title, content, client_version):
    stmt = (
       update(Note)
       .where(Note.id == note_id, Note.user_id == user_id, Note.version == client_version)
       .values(title=title, content=content, version=Note.version + 1, updated_at=func.now())
    )
    res = await db.execute(stmt)
    if res.rowcount == 0:
        # no row updated → version mismatch or not found
        return None
    await db.commit()
    return await get_note_by_id(db, note_id, user_id)

async def delete_note(db, note_id, user_id):
    stmt = delete(Note).where(Note.id == note_id, Note.user_id == user_id)
    res = await db.execute(stmt)
    await db.commit()
    return res.rowcount
