import { Router } from 'express';
import { body, param } from 'express-validator';
import { getNotes, createNote, updateNote, deleteNote } from '../controllers/notesController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Validation rules
const createNoteValidation = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('content').optional().isLength({ max: 10000 }).withMessage('Content must be less than 10000 characters'),
];

const updateNoteValidation = [
  param('id').isMongoId().withMessage('Invalid note ID'),
  body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be less than 200 characters'),
  body('content').optional().isLength({ max: 10000 }).withMessage('Content must be less than 10000 characters'),
];

const deleteNoteValidation = [
  param('id').isMongoId().withMessage('Invalid note ID'),
];

// Routes
router.get('/', getNotes);
router.post('/', createNoteValidation, createNote);
router.put('/:id', updateNoteValidation, updateNote);
router.delete('/:id', deleteNoteValidation, deleteNote);

export default router;