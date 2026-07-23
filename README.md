# Store Rating Platform

A production-ready full-stack application for store ratings with role-based access control.

## Tech Stack

- **Backend:** Express.js (MVC + Service + Repository)
- **Database:** MySQL
- **Frontend:** React.js (Vite)
- **Auth:** JWT + bcrypt

## Roles

| Role | Capabilities |
|------|-------------|
| System Administrator | Manage users/stores, dashboard stats, filter/sort listings |
| Normal User | Register, browse stores, submit/update ratings |
| Store Owner | View raters and average rating for their store |

## Project Structure

```
store-rating-platform/
├── backend/                 # Express API
│   ├── src/
│   │   ├── config/          # DB, env, logger
│   │   ├── controllers/     # Thin HTTP handlers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Database queries
│   │   ├── middleware/      # Auth, RBAC, validation, errors
│   │   ├── routes/          # Route definitions
│   │   ├── validators/      # express-validator schemas
│   │   └── utils/             # Helpers
│   └── database/            # SQL schema & seeds
├── frontend/                # React SPA
│   └── src/
│       ├── components/      # Reusable UI
│       ├── pages/           # Route pages
│       ├── services/        # Axios API layer
│       ├── context/         # Auth context
│       ├── hooks/           # Custom hooks
│       └── routes/          # Protected routes
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8+

### Backend

```bash
cd backend
cp .env.example .env   # Configure DB and JWT secret
npm install
npm run migrate
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

See `backend/.env.example` for required configuration.
