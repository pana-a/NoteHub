const { validationResult } = require('express-validator');
const {
  findAllAccessibleForUser,
  findById,
  create,
  update,
  remove
} = require('../models/Note');

const getAllNotes = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const notes = await findAllAccessibleForUser(ownerId);
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to get notes' });
  }
};

const getNoteById = async (req, res) => {
  try {
    const id = req.params.id
    const userId = req.user.userId

    const note = await findById(id)

    if (!note) {
      return res.status(404).json({ error: 'Note not found' })
    }

    const isOwner = note.ownerId === userId
    const isShared =
      Array.isArray(note.sharedWith) && note.sharedWith.includes(userId)

    if (!isOwner && !isShared) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    return res.status(200).json(note)
  } catch (error) {
    console.error('Error fetching note:', error)
    return res.status(500).json({ error: 'Failed to fetch note' })
  }
}

const createNote = async (req, res) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return res.status(400).json({ error: validationErrors.array() });
  }

  try {
    const ownerId = req.user.userId;
    const { title, content, tags = [] } = req.body;

    const now = new Date().toISOString();

    const newNote = {
      ownerId,
      title: title.trim(),
      content,
      tags,
      sharedWith: [],
      createdAt: now,
      updatedAt: now
    };

    const noteId = await create(newNote);

    res.status(201).json({ id: noteId });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ error: 'Failed to add note' });
  }
};

const updateNote = async (req, res) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return res.status(400).json({ error: validationErrors.array() });
  }

  try {
    const id = req.params.id;

    const existing = await findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (existing.ownerId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { title, content, tags } = req.body;

    const updateData = {
      title: title.trim(),
      content: content,
      updatedAt: new Date().toISOString()
    };

    if (tags !== undefined) {
      updateData.tags = tags;
    }

    const updatedNote = await update(id, updateData);

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
};

const deleteNote = async (req, res) => {
  try {
    const id = req.params.id;

    const existing = await findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (existing.ownerId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await remove(id);

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
};

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
};
