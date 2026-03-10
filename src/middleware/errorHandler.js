'use strict';

/**
 * Catch-all for unmatched routes.
 */
const notFound = (req, res, next) => {
  const err = new Error(`Route not found — ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

/**
 * Centralised error handler.
 * Must be registered LAST in app.js (after all routes).
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next  — required by Express (4 args)
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'test') {
    console.error(`[ERROR] ${statusCode} — ${message}`);
    if (err.stack) console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
module.exports.notFound = notFound;
