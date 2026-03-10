'use strict';

/**
 * Standardised API response helpers.
 * Use these throughout controllers and middleware to keep response shapes consistent.
 */

/**
 * Send a successful response.
 *
 * @param {import('express').Response} res
 * @param {number} statusCode   HTTP status code (default 200)
 * @param {string} message      Human-readable message
 * @param {*}      data         Payload to include in the response
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
  const body = { success: true, statusCode, message };
  if (data !== null) body.data = data;
  return res.status(statusCode).json(body);
};

/**
 * Send an error response.
 *
 * @param {import('express').Response} res
 * @param {number} statusCode   HTTP status code (default 500)
 * @param {string} message      Human-readable error message
 * @param {*}      errors       Optional validation error array or details
 */
const sendError = (res, statusCode = 500, message = 'Something went wrong', errors = null) => {
  const body = { success: false, statusCode, message };
  if (errors !== null) body.errors = errors;
  return res.status(statusCode).json(body);
};

module.exports = { sendSuccess, sendError };
