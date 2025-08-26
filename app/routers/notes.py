from fastapi import APIRouter, Depends, HTTPException, status
from ..schemas import NoteCreate, NoteOut
from ..deps import get_current_user, get_db
from .. import crud

router = APIRouter(prefix="/notes", tags=["notes"])

@router.post("", response_model=NoteOut, status_code=201)
async def create_note(payload: NoteCreate, db=Depends(get_db), user=Depends(get_current_user)):
    note = await crud.create_note(db, user.id, payload.title, payload.content)
    return note

@router.get("", response_model=list[NoteOut])
async def list_notes(db=Depends(get_db), user=Depends(get_current_user)):
    return await crud.get_notes_for_user(db, user.id)

@router.get("/{note_id}", response_model=NoteOut)
async def get_note(note_id: int, db=Depends(get_db), user=Depends(get_current_user)):
    note = await crud.get_note_by_id(db, note_id, user.id)
    if not note:
        raise HTTPException(404, "Not found")
    return note

# Update with client-provided version for optimistic locking:
@router.put("/{note_id}", response_model=NoteOut)
async def update_note(note_id: int, payload: NoteCreate, version: int, db=Depends(get_db), user=Depends(get_current_user)):
    updated = await crud.update_note_with_version(db, note_id, user.id, payload.title, payload.content, version)
    if updated is None:
        raise HTTPException(status_code=409, detail="Note was modified by another process")
    return updated

@router.delete("/{note_id}")
async def delete_note(note_id: int, db=Depends(get_db), user=Depends(get_current_user)):
    count = await crud.delete_note(db, note_id, user.id)
    if not count:
        raise HTTPException(404, "Not found")
    return {"message": "Note deleted"}
