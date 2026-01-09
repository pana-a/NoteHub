const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.json({ status: 'NoteHub API running' });
});


module.exports = app;
