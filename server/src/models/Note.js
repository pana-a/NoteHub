const db = require('../db/db');

const notesCollection = db.collection('notes');

const findAllByOwner = async (ownerId) => {
  const snapshot = await notesCollection
    .where('ownerId', '==', ownerId)
    .get();

  const notes = [];

  snapshot.forEach(doc => {
    notes.push({
      id: doc.id,
      ...doc.data()
    });
  });

  return notes;
};

const findById = async (id) => {
  const doc = await notesCollection.doc(id).get();

  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data()
  };
};

const create = async (noteData) => {
  const docRef = await notesCollection.add(noteData);
  return docRef.id;
};

const update = async (id, updateData) => {
  const docRef = notesCollection.doc(id);
  await docRef.update(updateData);

  const updatedDoc = await docRef.get();

  return {
    id: updatedDoc.id,
    ...updatedDoc.data()
  };
};

const remove = async (id) => {
  const docRef = notesCollection.doc(id);
  await docRef.delete();
};

module.exports = {
  findAllByOwner,
  findById,
  create,
  update,
  remove
};
