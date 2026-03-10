'use strict';

const { Router } = require('express');
const { body } = require('express-validator');

const {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { apiLimiter, authLimiter } = require('../middleware/rateLimiter');

const router = Router();

// ── Validation rule sets ──────────────────────────────────────────────────────
const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];

const loginRules = [
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const updateRules = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be blank'),
  body('email').optional().isEmail().withMessage('A valid email is required').normalizeEmail(),
];

// ── Public routes (stricter auth limiter) ─────────────────────────────────────
router.post('/register', authLimiter, registerRules, validate, register);
router.post('/login', authLimiter, loginRules, validate, login);

// ── Protected routes (general limiter) ────────────────────────────────────────
router.get('/', apiLimiter, protect, getAllUsers);
router.get('/:id', apiLimiter, protect, getUserById);
router.put('/:id', apiLimiter, protect, updateRules, validate, updateUser);
router.delete('/:id', apiLimiter, protect, deleteUser);

module.exports = router;
