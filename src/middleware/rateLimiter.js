'use strict';

const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter — applied to all routes.
 * Allows up to 100 requests per 15 minutes per IP.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many requests — please try again later.',
  },
});

/**
 * Strict limiter for authentication endpoints (register / login).
 * Allows up to 10 requests per 15 minutes per IP to slow brute-force attacks.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many authentication attempts — please try again later.',
  },
});

module.exports = { apiLimiter, authLimiter };
