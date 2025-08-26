
from fastapi import APIRouter, Depends, HTTPException, status, Query
from ..schemas import NoteCreate, NoteOut
from ..deps import get_current_user
from .. import crud, models

router = APIRouter(prefix="/notes", tags=["notes"])

@router.post("", response_model=NoteOut, status_code=status.HTTP_201_CREATED)
async def create_note_endpoint(
    payload: NoteCreate, user: models.User = Depends(get_current_user)
):
    note = await crud.create_note(str(user.id), payload)
    return note

@router.get("", response_model=list[NoteOut])
async def list_notes_endpoint(user: models.User = Depends(get_current_user)):
    return await crud.get_notes_for_user(str(user.id))

@router.get("/{note_id}", response_model=NoteOut)
async def get_note_endpoint(note_id: str, user: models.User = Depends(get_current_user)):
    note = await crud.get_note_by_id(note_id, str(user.id))
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.put("/{note_id}", response_model=NoteOut)
async def update_note_endpoint(
    note_id: str,
    payload: NoteCreate,
    version: int = Query(..., description="The version of the note you are updating."),
    user: models.User = Depends(get_current_user)
):
    updated_note = await crud.update_note_with_version(
        note_id, str(user.id), payload.title, payload.content, version
    )
    if updated_note is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Conflict: The note was modified by another process. Please refetch and try again.",
        )
    return updated_note

@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note_endpoint(note_id: str, user: models.User = Depends(get_current_user)):
    deleted = await crud.delete_note(note_id, str(user.id))
    if not deleted:
        raise HTTPException(status_code=404, detail="Note not found")
    return None