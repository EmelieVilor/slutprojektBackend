import express from 'express';

//global felhantering

export const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: 'Något gick fel på servern.' });
};

export default errorHandler;