# Architecture & API Design

## 1. Requirements Summary

| Actor | Key Actions |
|-------|-------------|
| **Admin** | CRUD users/stores, dashboard stats, filter/sort all listings |
| **Normal User** | Register, login, browse/search stores, submit/update ratings (1–5) |
| **Store Owner** | Login, view raters list, view average rating |

### Validation Rules

| Field | Rule |
|-------|------|
| Name | 20–60 characters |
| Address | Max 400 characters |
| Password | 8–16 chars, ≥1 uppercase, ≥1 special character |
| Email | Standard email format |
| Rating | Integer 1–5 |

---

## 2. Architecture

```
┌─────────────┐     HTTP/JSON      ┌──────────────────────────────────┐
│  React SPA  │ ◄────────────────► │         Express API              │
│  (Vite)     │                    │  Routes → Controllers → Services │
└─────────────┘                    │              ↓                   │
                                   │         Repositories             │
                                   └──────────────┬───────────────────┘
                                                  │
                                                  ▼
                                           ┌─────────────┐
                                           │   MySQL     │
                                           └─────────────┘
```

### Layer Responsibilities

| Layer | Responsibility |
|-------|----------------|
| **Routes** | HTTP method + path mapping, middleware chain |
| **Controllers** | Parse request, call service, format response |
| **Services** | Business rules, orchestration, authorization checks |
| **Repositories** | Parameterized SQL queries only |
| **Middleware** | JWT auth, RBAC, validation, error handling |

---

## 3. Database Schema

### ERD

```
users (1) ──────< (N) ratings (N) >────── (1) stores
  │                                              │
  │                                              │
  └──────── owner_id (1:1 for STORE_OWNER) ──────┘
```

### Tables

#### `users`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PK, AUTO_INCREMENT |
| name | VARCHAR(60) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| address | VARCHAR(400) | NOT NULL |
| role | ENUM('ADMIN','USER','STORE_OWNER') | NOT NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP |

#### `stores`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PK, AUTO_INCREMENT |
| name | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| address | VARCHAR(400) | NOT NULL |
| owner_id | INT | FK → users(id), UNIQUE (one store per owner) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP |

#### `ratings`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PK, AUTO_INCREMENT |
| user_id | INT | FK → users(id), NOT NULL |
| store_id | INT | FK → stores(id), NOT NULL |
| rating | TINYINT | CHECK 1–5, NOT NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP |
| | | UNIQUE(user_id, store_id) |

### Indexes
- `users(email)`, `users(role)`, `users(name)`
- `stores(name)`, `stores(email)`, `stores(owner_id)`
- `ratings(store_id)`, `ratings(user_id)`

---

## 4. REST API Design

Base URL: `/api`

### Auth (Public / Authenticated)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Normal user signup |
| POST | `/auth/login` | Public | Login (all roles) |
| PUT | `/auth/password` | JWT | Update own password |

### Admin (`ADMIN` role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/dashboard` | Stats: total users, stores, ratings |
| POST | `/admin/users` | Create user (any role) |
| GET | `/admin/users` | List users (filter, sort, paginate) |
| GET | `/admin/users/:id` | User detail (+ store rating if owner) |
| POST | `/admin/stores` | Create store + assign owner |
| GET | `/admin/stores` | List stores (filter, sort, paginate) |

**Query params (list endpoints):** `page`, `limit`, `sortBy`, `sortOrder`, `name`, `email`, `address`, `role`

### Stores — Normal User (`USER` role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stores` | List stores with overall + user's rating |
| POST | `/stores/:id/ratings` | Submit rating |
| PUT | `/stores/:id/ratings` | Update own rating |

**Query params:** `page`, `limit`, `sortBy`, `sortOrder`, `name`, `address`

### Store Owner (`STORE_OWNER` role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/store-owner/dashboard` | Average rating + summary |
| GET | `/store-owner/ratings` | Users who rated their store |

**Query params (ratings list):** `page`, `limit`, `sortBy`, `sortOrder`

### Response Envelope

```json
{
  "success": true,
  "data": { },
  "meta": { "page": 1, "limit": 10, "total": 100, "totalPages": 10 }
}
```

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 5. Authentication & Authorization

- **JWT** in `Authorization: Bearer <token>` header
- Token payload: `{ id, email, role }`
- **bcrypt** (cost factor 12) for password hashing
- Middleware chain: `authenticate` → `authorize(...roles)` → `validate` → controller

---

## 6. Folder Structure

### Backend
```
backend/
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   ├── migrate.js
│   └── seed.js
├── src/
│   ├── config/          env.js, database.js
│   ├── controllers/     auth, admin, store, rating, storeOwner
│   ├── services/        matching service files
│   ├── repositories/    user, store, rating
│   ├── middleware/      auth, authorize, validate, error
│   ├── routes/          route modules
│   ├── validators/      express-validator chains
│   ├── utils/           logger, AppError, asyncHandler, queryBuilder
│   ├── app.js
│   └── server.js
├── .env.example
└── package.json
```

### Frontend
```
frontend/src/
├── components/    Button, Input, Table, Layout, Navbar, RatingStars
├── pages/
│   ├── auth/      Login, Register
│   ├── admin/     Dashboard, Users, Stores, UserDetail
│   ├── user/      StoreList
│   └── owner/     OwnerDashboard
├── services/      api.js, authService, adminService, storeService
├── context/       AuthContext
├── hooks/         useAuth
├── routes/        AppRoutes, ProtectedRoute
├── utils/         validation.js
├── App.jsx
└── main.jsx
```

---

## 7. Implementation Order

1. ✅ Project Setup
2. Database Design & Migration
3. Authentication & Authorization
4. Admin Module
5. User Module (store browsing)
6. Store Owner Module
7. Rating System
8. Search, Filter, Sort, Pagination
9. Dashboard
10. Frontend Integration
11. Testing & Final Review
