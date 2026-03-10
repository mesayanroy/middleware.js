# middleware.js — Professional Express Boilerplate

A production-ready Node.js / Express boilerplate that demonstrates best practices for structuring **middleware** and **controllers**.

---

## Project Structure

```
.
├── src/
│   ├── app.js                  # Express application (middleware + routes)
│   ├── server.js               # Server entry point (DB connection + listen)
│   ├── config/
│   │   └── config.js           # Centralised configuration (env vars)
│   ├── controllers/
│   │   └── userController.js   # CRUD controller for the User resource
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication (protect routes)
│   │   ├── errorHandler.js     # Global error handler + 404 handler
│   │   ├── logger.js           # HTTP request logger
│   │   ├── rateLimiter.js      # API + auth rate limiters
│   │   └── validate.js         # express-validator error collector
│   ├── models/
│   │   └── userModel.js        # Mongoose User schema / model
│   ├── routes/
│   │   └── userRoutes.js       # Express router (public + protected routes)
│   └── utils/
│       └── response.js         # Standardised sendSuccess / sendError helpers
├── .env.example                # Environment variable template
├── .gitignore
└── package.json
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
# Edit .env and fill in your values
```

| Variable         | Description                      | Default                                  |
| ---------------- | -------------------------------- | ---------------------------------------- |
| `PORT`           | Port the server listens on       | `3000`                                   |
| `NODE_ENV`       | Runtime environment              | `development`                            |
| `MONGO_URI`      | MongoDB connection string        | `mongodb://localhost:27017/middleware_db` |
| `JWT_SECRET`     | Secret used to sign JWTs         | —                                        |
| `JWT_EXPIRES_IN` | Token lifetime                   | `7d`                                     |

### 3. Run the server

```bash
# Development (auto-restart with nodemon)
npm run dev

# Production
npm start
```

---

## API Endpoints

### Users

| Method | Path                  | Auth    | Description             |
| ------ | --------------------- | ------- | ----------------------- |
| POST   | `/api/users/register` | Public  | Register a new user     |
| POST   | `/api/users/login`    | Public  | Login and receive a JWT |
| GET    | `/api/users`          | 🔒 JWT | List all users          |
| GET    | `/api/users/:id`      | 🔒 JWT | Get a user by ID        |
| PUT    | `/api/users/:id`      | 🔒 JWT | Update a user by ID     |
| DELETE | `/api/users/:id`      | 🔒 JWT | Delete a user by ID     |

### Health check

```
GET /health   →   { "status": "ok" }
```

---

## Middleware Overview

| File                           | Purpose                                                       |
| ------------------------------ | ------------------------------------------------------------- |
| `middleware/auth.js`           | Verifies `Authorization: Bearer <token>` on protected routes  |
| `middleware/errorHandler.js`   | Catches all errors; formats JSON error responses              |
| `middleware/logger.js`         | Logs method, URL, status, and duration for each request       |
| `middleware/rateLimiter.js`    | Limits requests per IP — 100/15 min (API), 10/15 min (auth)  |
| `middleware/validate.js`       | Collects express-validator errors and returns a 422 response  |

---

## Response Format

All responses share a consistent shape:

**Success**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users fetched successfully",
  "data": []
}
```

**Error**
```json
{
  "success": false,
  "statusCode": 422,
  "message": "Validation failed",
  "errors": [{ "msg": "A valid email is required", "path": "email" }]
}
```

---

## Running Tests

```bash
npm test
```
