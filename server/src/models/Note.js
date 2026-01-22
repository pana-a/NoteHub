const admin = require('firebase-admin')
const db = require('../db/db')

const notesCollection = db.collection('notes')

const findAllByOwner = async (ownerId) => {
  const snapshot = await notesCollection.where('ownerId', '==', ownerId).get()

  const notes = []

  snapshot.forEach((doc) => {
    notes.push({
      id: doc.id,
      ...doc.data()
    })
  })

  return notes
}

const findAllAccessibleForUser = async (userId) => {
  const [ownedSnap, sharedSnap] = await Promise.all([
    notesCollection.where('ownerId', '==', userId).get(),
    notesCollection.where('sharedWith', 'array-contains', userId).get()
  ])

  const map = new Map()

  ownedSnap.forEach((doc) => {
    map.set(doc.id, { id: doc.id, ...doc.data(), access: 'owner' })
  })

  sharedSnap.forEach((doc) => {
    if (!map.has(doc.id)) {
      map.set(doc.id, { id: doc.id, ...doc.data(), access: 'shared' })
    }
  })

  return Array.from(map.values())
}

const findById = async (id) => {
  const doc = await notesCollection.doc(id).get()

  if (!doc.exists) {
    return null
  }

  return {
    id: doc.id,
    ...doc.data()
  }
}

const create = async (noteData) => {
  const docRef = await notesCollection.add(noteData)
  return docRef.id
}

const update = async (id, updateData) => {
  const docRef = notesCollection.doc(id)
  await docRef.update(updateData)

  const updatedDoc = await docRef.get()

  return {
    id: updatedDoc.id,
    ...updatedDoc.data()
  }
}

const remove = async (id) => {
  const docRef = notesCollection.doc(id)
  await docRef.delete()
}

const removeSharedUser = async (noteId, userId) => {
  const docRef = notesCollection.doc(noteId)
  const snap = await docRef.get()

  if (!snap.exists) {
    return null
  }

  await docRef.update({
    sharedWith: admin.firestore.FieldValue.arrayRemove(userId),
    updatedAt: new Date().toISOString()
  })

  return true
}

module.exports = {
  findAllByOwner,
  findAllAccessibleForUser,
  findById,
  create,
  update,
  remove,
  removeSharedUser
}
