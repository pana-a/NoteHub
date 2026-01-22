const admin = require('firebase-admin')
const { validationResult } = require('express-validator')

const { findById: findNoteById } = require('../models/Note')
const {
  findPendingForEmail,
  findPendingByNoteAndEmail,
  findById,
  create,
  update
} = require('../models/Invitation')

const db = require('../db/db')
const notesCollection = db.collection('notes')

const listMyInvitations = async (req, res) => {
  try {
    const email = req.user.email
    const invites = await findPendingForEmail(email)

    const noteIds = Array.from(
      new Set(invites.map((i) => i.noteId).filter(Boolean))
    )

    const noteDocs = await Promise.all(
      noteIds.map((id) => notesCollection.doc(id).get())
    )

    const noteMap = new Map()
    noteDocs.forEach((doc) => {
      if (!doc.exists) return
      const data = doc.data() || {}

      const title = data.title || 'Untitled'
      const content = typeof data.content === 'string' ? data.content : ''
      const trimmed = content.trim()
      const preview =
        trimmed.length <= 160 ? trimmed : trimmed.slice(0, 160) + '...'

      const tags = Array.isArray(data.tags) ? data.tags : []

      noteMap.set(doc.id, { title, preview, tags })
    })

    const enriched = invites.map((inv) => ({
      ...inv,
      note: noteMap.get(inv.noteId) || null
    }))

    return res.status(200).json(enriched)
  } catch (error) {
    console.error('List invitations error:', error)
    return res.status(500).json({ error: 'Failed to list invitations' })
  }
}

const sendInvitation = async (req, res) => {
  const validationErrors = validationResult(req)
  if (!validationErrors.isEmpty()) {
    return res.status(400).json({ error: validationErrors.array() })
  }

  try {
    const noteId = req.params.noteId
    const { toEmail } = req.body

    const note = await findNoteById(noteId)
    if (!note) {
      return res.status(404).json({ error: 'Note not found' })
    }

    if (note.ownerId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    if (toEmail === req.user.email) {
      return res.status(400).json({ error: 'You cannot invite yourself' })
    }

    const existingPending = await findPendingByNoteAndEmail(noteId, toEmail)
    if (existingPending) {
        return res.status(409).json({ error: 'Invitation already sent' })
    }

    const now = new Date().toISOString()

    const invitation = {
      noteId,
      fromUserId: req.user.userId,
      fromEmail: req.user.email,
      toEmail,
      toUserId: null,
      status: 'pending',
      createdAt: now,
      respondedAt: null
    }

    const invitationId = await create(invitation)
    return res.status(201).json({ id: invitationId })
  } catch (error) {
    console.error('Send invitation error:', error)
    return res.status(500).json({ error: 'Failed to send invitation' })
  }
}

const acceptInvitation = async (req, res) => {
  try {
    const invitationId = req.params.id
    const inv = await findById(invitationId)

    if (!inv) return res.status(404).json({ error: 'Invitation not found' })
    if (inv.status !== 'pending') {
      return res.status(400).json({ error: 'Invitation already processed' })
    }

    if (inv.toEmail !== req.user.email) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    await notesCollection.doc(inv.noteId).update({
      sharedWith: admin.firestore.FieldValue.arrayUnion(req.user.userId),
      updatedAt: new Date().toISOString()
    })

    const updated = await update(invitationId, {
      status: 'accepted',
      toUserId: req.user.userId,
      respondedAt: new Date().toISOString()
    })

    return res.status(200).json(updated)
  } catch (error) {
    console.error('Accept invitation error:', error)
    return res.status(500).json({ error: 'Failed to accept invitation' })
  }
}

const declineInvitation = async (req, res) => {
  try {
    const invitationId = req.params.id
    const inv = await findById(invitationId)

    if (!inv) return res.status(404).json({ error: 'Invitation not found' })
    if (inv.status !== 'pending') {
      return res.status(400).json({ error: 'Invitation already processed' })
    }

    if (inv.toEmail !== req.user.email) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const updated = await update(invitationId, {
      status: 'declined',
      toUserId: req.user.userId,
      respondedAt: new Date().toISOString()
    })

    return res.status(200).json(updated)
  } catch (error) {
    console.error('Decline invitation error:', error)
    return res.status(500).json({ error: 'Failed to decline invitation' })
  }
}

module.exports = {
  listMyInvitations,
  sendInvitation,
  acceptInvitation,
  declineInvitation
}
