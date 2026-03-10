'use strict';

/**
 * Lightweight custom HTTP request logger middleware.
 * For production-grade logging, combine with a library such as winston or pino.
 */
const logger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} — ${duration}ms`
    );
  });

  next();
};

module.exports = logger;
