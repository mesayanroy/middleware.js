'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const config = require('../config/config');
const { sendSuccess, sendError } = require('../utils/response');

// ── Helper ────────────────────────────────────────────────────────────────────
const signToken = (userId) =>
  jwt.sign({ id: userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * @desc  Register a new user
 * @route POST /api/users/register
 * @access Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return sendError(res, 409, 'A user with that email already exists');
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    return sendSuccess(res, 201, 'User registered successfully', { user, token });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc  Login an existing user
 * @route POST /api/users/login
 * @access Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const token = signToken(user._id);

    // toJSON transform removes the password field before serialisation
    return sendSuccess(res, 200, 'Login successful', { user, token });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc  Get all users  (admin only in real apps — simplified here)
 * @route GET /api/users
 * @access Private
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return sendSuccess(res, 200, 'Users fetched successfully', users);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc  Get a single user by ID
 * @route GET /api/users/:id
 * @access Private
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }
    return sendSuccess(res, 200, 'User fetched successfully', user);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc  Update a user by ID
 * @route PUT /api/users/:id
 * @access Private
 * @note  In production add an ownership / role check:
 *        if (req.user.id !== req.params.id && req.user.role !== 'admin') return sendError(res, 403, 'Forbidden');
 */
const updateUser = async (req, res, next) => {
  try {
    const allowedFields = { name: req.body.name, email: req.body.email };

    // Remove undefined keys so we don't overwrite with null
    Object.keys(allowedFields).forEach(
      (key) => allowedFields[key] === undefined && delete allowedFields[key]
    );

    const user = await User.findByIdAndUpdate(req.params.id, allowedFields, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    return sendSuccess(res, 200, 'User updated successfully', user);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc  Delete a user by ID
 * @route DELETE /api/users/:id
 * @access Private
 * @note  In production add an ownership / role check:
 *        if (req.user.id !== req.params.id && req.user.role !== 'admin') return sendError(res, 403, 'Forbidden');
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }
    return sendSuccess(res, 200, 'User deleted successfully', null);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getAllUsers, getUserById, updateUser, deleteUser };
