const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const noteRoutes = require('./routes/notes');

const app = express();
app.use(cors());
app.use(express.json())


app.get('/', (req, res) => {
  res.json({ status: 'NoteHub API running' });
});

app.use('/users', userRoutes)
app.use('/notes', noteRoutes);

const db = require('./db/db')
console.log('Firestore ready:', !!db)

module.exports = app;
