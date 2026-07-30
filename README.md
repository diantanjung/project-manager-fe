# Project Manager Frontend

Project Manager Frontend is a React, TypeScript, and Vite application for managing projects, teams, users, and tasks through a modern web interface. It connects to a REST API backend and provides authenticated workspaces with dashboards, project boards, task details, notifications, comments, and attachment support.

## Features

- Authentication pages for login, registration, and protected user sessions.
- Dashboard with project and task statistics, recent activity, deadlines, and priority task summaries.
- Project task board with Kanban columns for backlog, to do, in progress, review, and done.
- Task list mode with search, filtering, pagination, and task detail dialogs.
- Drag-and-drop task status updates using `@hello-pangea/dnd`.
- Admin user and team management pages.
- Notification, comment, upload, and attachment service integrations.
- Zustand stores for client-side state management.
- Vitest and Testing Library coverage for services, stores, pages, and shared components.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Zustand
- Axios
- Tailwind CSS
- React Hook Form
- Vitest

## Requirements

- Node.js
- npm
- A running backend API compatible with the configured endpoints

## Environment Variables

Create or update a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

The application normalizes the API URL to use the `/api/v1` path. If `VITE_API_URL` is not set, it falls back to `http://localhost:8000`.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Available Scripts

- `npm run dev` starts the Vite development server.
- `npm run build` runs TypeScript project builds and creates a production bundle.
- `npm run lint` runs ESLint across the project.
- `npm run test` runs the Vitest test suite.
- `npm run preview` serves the production build locally.

## Project Structure

```text
src/
  components/      Reusable UI components grouped by feature.
  features/        Feature-specific UI modules.
  hooks/           Shared React hooks.
  layouts/         Application layout components.
  lib/             Shared library configuration, including Axios.
  pages/           Route-level pages.
  services/        API service modules.
  stores/          Zustand stores.
  test/            Test setup.
  types/           Shared TypeScript types.
  utils/           Utility helpers.
```

## Main Routes

- `/login` and `/register` for authentication.
- `/dashboard` for the main project and task overview.
- `/project/:projectId` for the project board and task list.
- `/profile` for user profile management.
- `/admin/users` for admin user management.
- `/admin/teams` for admin team management.

## API Notes

The Axios client is configured with credentials enabled so HttpOnly refresh cookies can be sent with requests. Access tokens are kept in memory and attached to outgoing requests. When the API returns `401`, the client attempts to refresh the access token through the backend refresh endpoint before redirecting to the login page.
