const db = require('../db/db')

const invitationsCollection = db.collection('invitations')

const findPendingForEmail = async (email) => {
  const snapshot = await invitationsCollection
    .where('toEmail', '==', email)
    .where('status', '==', 'pending')
    .get()

  const invitations = []
  snapshot.forEach((doc) => {
    invitations.push({
      id: doc.id,
      ...doc.data()
    })
  })

  return invitations
}

const findPendingByNoteAndEmail = async (noteId, toEmail) => {
  const snapshot = await invitationsCollection
    .where('noteId', '==', noteId)
    .where('toEmail', '==', toEmail)
    .where('status', '==', 'pending')
    .get()

  if (snapshot.empty) return null

  const doc = snapshot.docs[0]
  return { id: doc.id, ...doc.data() }
}


const findById = async (id) => {
  const doc = await invitationsCollection.doc(id).get()
  if (!doc.exists) return null

  return {
    id: doc.id,
    ...doc.data()
  }
}

const create = async (invitationData) => {
  const docRef = await invitationsCollection.add(invitationData)
  return docRef.id
}

const update = async (id, updateData) => {
  const docRef = invitationsCollection.doc(id)
  await docRef.update(updateData)

  const updatedDoc = await docRef.get()
  return {
    id: updatedDoc.id,
    ...updatedDoc.data()
  }
}

const remove = async (id) => {
  const docRef = invitationsCollection.doc(id)
  await docRef.delete()
}

module.exports = {
  findPendingForEmail,
  findPendingByNoteAndEmail,
  findById,
  create,
  update,
  remove
}
