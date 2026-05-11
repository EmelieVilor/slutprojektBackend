import express from 'express';

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: 'Internt serverfel.' });
});

// handleMySQLError