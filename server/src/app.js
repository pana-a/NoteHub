const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');

const app = express();
app.use(cors());
app.use(express.json())


app.get('/', (req, res) => {
  res.json({ status: 'NoteHub API running' });
});

app.use('/users', userRoutes)

const db = require('./db/db')
console.log('Firestore ready:', !!db)

module.exports = app;
