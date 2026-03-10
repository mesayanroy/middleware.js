'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { sendError } = require('../utils/response');

/**
 * Protect routes — verifies the JWT sent in the Authorization header.
 * Expected header format:  Authorization: Bearer <token>
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, 'Not authorized — no token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (err) {
    return sendError(res, 401, 'Not authorized — token invalid or expired');
  }
};

module.exports = { protect };
