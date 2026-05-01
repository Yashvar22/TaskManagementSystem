# 🚀 Team Task Manager

A production-ready, full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) application for managing team projects and tasks — inspired by Jira and Trello.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure signup/login with bcrypt password hashing
- 🛡️ **Role-Based Access Control (RBAC)** — Admin and Member roles with enforced permissions
- 📋 **Kanban Board** — Drag-and-drop task management with Todo → In Progress → Done columns
- 📊 **Aggregated Dashboard** — Real-time stats: Total, Completed, Pending, and Overdue tasks
- 🚨 **Overdue Detection** — Visual highlights for tasks past their due date
- 🔍 **Project Search** — Instant search across projects
- 👥 **Team Management** — Add members to projects by email
- 🎨 **Modern UI** — Indigo-themed, responsive design with Tailwind CSS

---

## 🗂️ Project Structure

```
TaskMAnagementystem/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── config/             # DB connection
│   │   ├── constants/          # Roles, statuses, HTTP codes, messages
│   │   ├── controllers/        # Route handlers (thin layer)
│   │   ├── middlewares/        # Auth, error, validation middleware
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # Express routers
│   │   ├── services/           # Business logic layer
│   │   ├── utils/              # Helpers + seeder
│   │   ├── app.js              # Express app config
│   │   └── server.js           # Entry point
│   ├── .env                    # Environment variables
│   └── package.json
│
└── frontend/                   # React + Vite + Tailwind
    ├── src/
    │   ├── components/
    │   │   ├── layout/         # AppLayout, Sidebar, Topbar
    │   │   └── ui/             # Modal, LoadingSpinner
    │   ├── context/            # AuthContext (JWT state)
    │   ├── pages/              # Login, Signup, Dashboard, Projects, ProjectDetails
    │   ├── services/           # Axios API layer
    │   └── App.jsx             # Router setup
    ├── .env
    └── package.json
```

---

## 🛠️ Quick Start

### Prerequisites
- **Node.js** v18+
- **MongoDB** running locally (default: `mongodb://localhost:27017`)

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

**`backend/.env`** (already configured):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/team_task_manager
JWT_SECRET=your_super_secret_jwt_key_change_in_production_2024
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**`frontend/.env`** (already configured):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed the Database

```bash
cd backend
npm run seed
```

### 4. Start the Application

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# ✅ Server on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# ✅ App on http://localhost:5173
```

---

## 📧 Demo Credentials

| Role   | Email                      | Password    |
|--------|----------------------------|-------------|
| Admin  | admin@taskmanager.com      | admin123    |
| Member | bob@taskmanager.com        | member123   |
| Member | carol@taskmanager.com      | member123   |

> Use the **Demo Admin** / **Demo Member** buttons on the login page for quick access.

---

## 🔌 REST API Endpoints

### Auth
| Method | Endpoint           | Access  | Description          |
|--------|--------------------|---------|----------------------|
| POST   | `/api/auth/signup` | Public  | Register new user    |
| POST   | `/api/auth/login`  | Public  | Login + get token    |
| GET    | `/api/auth/me`     | Private | Get current user     |

### Projects
| Method | Endpoint                        | Access       | Description            |
|--------|---------------------------------|--------------|------------------------|
| POST   | `/api/projects`                 | Admin only   | Create project         |
| GET    | `/api/projects`                 | Authenticated | Get user's projects   |
| GET    | `/api/projects/:id`             | Members only | Get project details    |
| POST   | `/api/projects/:id/add-member`  | Admin only   | Add member by email    |

### Tasks
| Method | Endpoint         | Access         | Description                     |
|--------|------------------|----------------|---------------------------------|
| POST   | `/api/tasks`     | Admin only     | Create task                     |
| GET    | `/api/tasks?projectId=` | Members | Get project tasks          |
| PUT    | `/api/tasks/:id` | Assigned/Admin | Update task (members: status only) |
| DELETE | `/api/tasks/:id` | Admin only     | Delete task                     |

### Dashboard
| Method | Endpoint         | Access       | Description                |
|--------|------------------|--------------|----------------------------|
| GET    | `/api/dashboard` | Authenticated | Get aggregated stats      |

---

## 🔐 Security Features

- JWT tokens with configurable expiry
- bcrypt password hashing (salt rounds: 12)
- Helmet.js security headers
- Rate limiting (200 req/15min general, 20 req/15min for auth)
- CORS restricted to frontend origin
- Input validation with express-validator
- Centralized error handling with sanitized responses

---

## 🎨 Color System

| Token      | Color     | Use Case                   |
|------------|-----------|----------------------------|
| Primary    | `#4F46E5` | Indigo — buttons, accents  |
| Success    | `#10B981` | Green — Done status        |
| Warning    | `#F59E0B` | Amber — In Progress        |
| Danger     | `#EF4444` | Red — Overdue / Delete     |
| Info       | `#3B82F6` | Blue — Todo status         |
| Sidebar    | `#111827` | Dark background            |

---

## 🏗️ Architecture

```
Frontend (React)
    ↓ Axios (JWT Bearer token)
Backend (Express)
    → Routes → Controllers → Services → Models → MongoDB
    ← JSON Response ←
```

**Business Logic Rules:**
- Only project **members** can view project tasks
- Only **assigned user** or admin can update a task
- Members can only change the **status** field
- Task is **overdue** if `dueDate < now && status !== 'done'`
- Project **creator** is automatically added as a member

---

## 🧪 Sample Test Data (Seeded)

**3 Projects:**
- E-Commerce Platform (3 members, 5 tasks)
- Mobile App Redesign (2 members, 3 tasks)
- API Integration (2 members, 2 tasks)

**10 Tasks:** Mix of Todo, In Progress, Done, and Overdue statuses

---

*Built with ❤️ using the MERN stack — MongoDB, Express.js, React.js, Node.js*
