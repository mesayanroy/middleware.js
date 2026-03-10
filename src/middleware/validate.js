'use strict';

const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

/**
 * Run after express-validator check() / body() chains.
 * Returns a 422 response listing all validation errors when the request
 * does not pass validation.
 *
 * Usage:
 *   router.post('/', [body('email').isEmail(), validate], controller.create);
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return sendError(res, 422, 'Validation failed', errors.array());
  }

  next();
};

module.exports = validate;
