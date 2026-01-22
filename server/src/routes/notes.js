const express = require('express');
const router = express.Router();

const {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  leaveNote
} = require('../controllers/notes');

const { noteValidation } = require('../validators/noteValidator');
const { validateToken } = require('../middleware/auth');

const { sendInvitation } = require('../controllers/invitations');
const { invitationValidation } = require('../validators/invitationValidator');
router.post('/:noteId/invitations', validateToken, invitationValidation, sendInvitation);

router.get('/', validateToken, getAllNotes);
router.get('/:id', validateToken, getNoteById);

router.post('/', validateToken, noteValidation, createNote);
router.put('/:id', validateToken, noteValidation, updateNote);

router.patch('/:id/leave', validateToken, leaveNote);

router.delete('/:id', validateToken, deleteNote);

module.exports = router;
