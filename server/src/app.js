const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.json({ status: 'NoteHub API running' });
});

const db = require('./db/db')
console.log('Firestore ready:', !!db)

module.exports = app;
