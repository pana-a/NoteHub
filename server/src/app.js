const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json({ status: 'NoteHub API running' });
});

module.exports = app;
