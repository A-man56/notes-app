import { Response } from 'express';
import { validationResult } from 'express-validator';
import { Note } from '../models/Note.js';
import { AuthRequest } from '../middleware/auth.js';

export const getNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    
    const notes = await Note.find({ userId })
      .sort({ updatedAt: -1 })
      .lean();

    res.json({ notes });
  } catch (error: any) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: 'Validation failed', details: errors.array() });
      return;
    }

    const { title, content = '' } = req.body;
    const userId = req.user?._id;

    const note = new Note({
      title,
      content,
      userId
    });

    await note.save();

    res.status(201).json({
      message: 'Note created successfully',
      note
    });
  } catch (error: any) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: 'Validation failed', details: errors.array() });
      return;
    }

    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user?._id;

    const note = await Note.findOneAndUpdate(
      { _id: id, userId },
      { title, content },
      { new: true, runValidators: true }
    );

    if (!note) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    res.json({
      message: 'Note updated successfully',
      note
    });
  } catch (error: any) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const note = await Note.findOneAndDelete({ _id: id, userId });

    if (!note) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error: any) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};