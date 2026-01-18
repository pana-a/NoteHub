const express = require('express');
const router = express.Router();

const {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
} = require('../controllers/notes');

const { noteValidation } = require('../validators/noteValidator');
const { validateToken } = require('../middleware/auth');

router.get('/', validateToken, getAllNotes);
router.get('/:id', validateToken, getNoteById);

router.post('/', validateToken, noteValidation, createNote);
router.put('/:id', validateToken, noteValidation, updateNote);

router.delete('/:id', validateToken, deleteNote);

module.exports = router;
