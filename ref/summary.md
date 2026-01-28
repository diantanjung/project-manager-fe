
# Product Requirements Document (PRD): **Project Manager MVP**

## 1. Product Overview

A lightweight, high-performance **Project Management** application designed for teams to plan projects, manage tasks via Kanban boards, and monitor team workload and productivity.

The backend exposes a **well-documented REST API** using **Swagger (OpenAPI)** to ensure maintainability, frontend alignment, and extensibility.

---

## 2. Tech Stack

### Frontend

* **Framework:** Vite + React.js
* **Routing:** `react-router`
* **State Management:** `zustand`
* **HTTP Client:** `axios`
* **Forms:** `react-hook-form`
* **Schema Validation:** `zod`
* **Date UI:** `react-day-picker`
* **Styling:** Tailwind CSS
* **Interactive Components:** `dndkit` (Kanban drag-and-drop)
* **Charts:** `recharts`

> **Implementation Notes**

* UI components (buttons, dialogs, dropdowns, cards) are built in-house using Tailwind CSS.
* Accessibility and keyboard navigation must be handled explicitly.
* Consistent design tokens (spacing, colors, typography) must be defined.

---

### Backend

* **Runtime & Framework:** Node.js + Express.js
* **Database & ORM:** PostgreSQL with Drizzle ORM
* **Authentication:** **JWT (JSON Web Token)**
* **Storage:** Cloudflare R2 (attachments & profile pictures)
* **Email:** Resend (transactional notifications)
* **API Documentation:** Swagger (OpenAPI 3.0)

  * `swagger-jsdoc`
  * `swagger-ui-express`

---

## 3. Data Schema (Drizzle Representation)

The **Project Manager** domain model consists of:

* **User**
* **Team**
* **Project**
* **Task**
* **Comment**
* **Attachment**
* **TaskAssignment**

All entities must be reflected in **Swagger schemas** and validated using **Zod-compatible contracts** where applicable.

---

## 4. Feature Requirements

### 4.1 Authentication (JWT)

* Username & Password login
* Passwords stored using strong hashing (e.g., bcrypt)
* JWT issued on successful login
* Support for:

  * **Access Token** (short-lived)
  * **Refresh Token** (long-lived, optional but recommended)
* Secure token storage and transmission

#### Frontend

* Login form implemented with `react-hook-form`
* Validation via `zod`
* Authentication requests handled via `axios`
* JWT stored in:

  * HTTP-only cookies **(preferred)** or
  * In-memory state with refresh flow
* Auth state managed in `zustand`
* Axios interceptors:

  * Attach JWT to requests
  * Handle token expiration and refresh

#### Backend

* `/api/auth/login` – issues JWT
* `/api/auth/refresh` – refreshes access token (if applicable)
* `/api/auth/logout` – invalidates refresh token (if applicable)
* JWT verification middleware protects private routes

#### Swagger

* Security scheme defined as:

  * `bearerAuth` (JWT)
* Protected endpoints annotated with `security`
* Auth endpoints documented with request/response examples

---

### 4.2 Navigation: Sidebar Menu

* Custom Tailwind-based sidebar layout
* Dynamic project list
* Create Project modal (custom Tailwind dialog)
* User profile dropdown implemented manually

Navigation state handled by `zustand`.

---

### 4.3 Dashboard (Home)

* Metrics cards implemented as custom Tailwind components
* Charts rendered using `recharts`
* Data fetched via `axios`

---

### 4.4 Project Board (Kanban)

* Status columns:

  * Backlog
  * To Do
  * In Progress
  * Review
  * Done
* Task cards (custom Tailwind components)
* Drag-and-drop powered by `dndkit`
* Optimistic UI updates via `zustand`
* Task forms:

  * `react-hook-form`
  * `zod` validation
  * Due date selection via `react-day-picker`

---

### 4.5 Team Members

* Member cards built with Tailwind CSS
* Task statistics fetched via API
* Cached in `zustand`

---

## 5. Frontend Architecture Guidelines

### 5.1 Routing (`react-router`)

* Public Routes:

  * `/login`
* Protected Routes:

  * `/`
  * `/projects/:projectId`
  * `/team`

Route guards depend on JWT-authenticated state in `zustand`.

---

### 5.2 State Management (`zustand`)

Global Stores:

* `authStore`

  * user
  * accessToken (if stored in memory)
  * auth status
* `projectStore`
* `uiStore`

---

### 5.3 Forms & Validation

* All forms implemented using `react-hook-form`
* All validation schemas defined with `zod`
* Shared schemas between frontend and backend encouraged

---

## 6. Backend API & Swagger Specification

* No functional change to existing APIs.
* Additional auth endpoints documented.
* Swagger is the **single source of truth** for:

  * JWT security
  * Required headers
  * Auth error responses (`401`, `403`)

---

## 7. Development Phases

### Phase 1: Foundation

* Express + Drizzle setup
* JWT authentication (login, middleware)
* Swagger base configuration
* Frontend scaffolding (Router, Zustand, Axios)

### Phase 2: Core Features

* Project & Task CRUD
* Tailwind-based UI components
* Zod-based validation

### Phase 3: Project Board

* Kanban board
* Drag-and-drop
* Date picking

### Phase 4: Dashboard & Team

* Metrics and charts
* Team directory

### Phase 5: Assets & Notifications

* Cloudflare R2
* Resend email notifications

---

## 8. Non-Functional Requirements

* Secure JWT handling (XSS/CSRF considerations)
* UI consistency enforced via Tailwind design tokens
* Validation parity between frontend and backend
* Swagger as the single source of truth for API contracts
* Predictable state management with Zustand

---

If you want, I can next:

* Design the **JWT auth flow diagram** (login → refresh → logout)
* Define **Swagger auth schemas** (`bearerAuth`)
* Propose **Axios interceptor + refresh token patterns**
* Align **Drizzle user schema** with JWT claims
