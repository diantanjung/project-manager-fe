# Todo - February 1, 2026

## Backend API

### Database Setup
- [x] Initialize Drizzel with PostgreSQL
- [x] Create database schema
- [x] Run migrations
- [x] Seed initial data

---

### User Management (`/api/users`)
- [x] `POST /users` - Create user
- [x] `GET /users` - List users (pagination, filtering)
- [x] `GET /users/:userId` - Get user by ID
- [x] `PATCH /users/:userId` - Update user (username, profilePictureUrl, teamId)
- [x] `DELETE /users/:userId` - Delete user
- [x] `GET /users/:userId/tasks` - Get user's authored & assigned tasks

---

### Team Management (`/api/teams`)
- [x] `POST /teams` - Create team
- [x] `GET /teams` - List teams
- [x] `GET /teams/:id` - Get team by ID
- [x] `PATCH /teams/:id` - Update team (teamName, productOwnerUserId, projectManagerUserId)
- [x] `DELETE /teams/:id` - Delete team
- [x] `GET /teams/:id/members` - Get team members
- [x] `POST /teams/:id/members` - Add user to team
- [x] `DELETE /teams/:id/members/:userId` - Remove user from team

---

### Project Management (`/api/projects`)
- [x] `POST /projects` - Create project
- [x] `GET /projects` - List projects (pagination, filtering)
- [x] `GET /projects/:id` - Get project by ID
- [x] `PATCH /projects/:id` - Update project (name, description, startDate, endDate)
- [x] `DELETE /projects/:id` - Delete project
- [x] `GET /projects/:id/tasks` - Get project tasks
- [x] `GET /projects/:id/teams` - Get teams assigned to project

---

### Project-Team Assignment (`/api/project-teams`)
- [x] `POST /project-teams` - Assign team to project
- [x] `DELETE /project-teams/:id` - Remove team from project

---

### Task Management (`/api/tasks`)
- [x] `POST /tasks` - Create task
- [x] `GET /tasks` - List tasks (pagination, filtering by status/priority/project)
- [x] `GET /tasks/:id` - Get task by ID (include author, assignee, comments, attachments)
- [x] `PATCH /tasks/:id` - Update task (title, description, status, priority, tags, dates, points, assignedUserId)
- [x] `DELETE /tasks/:id` - Delete task
- [x] `PATCH /tasks/:id/status` - Update task status only

---

### Task Assignment (`/api/task-assignments`)
- [x] `POST /task-assignments` - Assign user to task
- [x] `GET /tasks/:taskId/assignments` - Get task assignments
- [x] `DELETE /task-assignments/:id` - Remove assignment

---

### Attachment Management (`/api/attachments`)
- [x] `POST /tasks/:taskId/attachments` - Upload attachment
- [x] `GET /tasks/:taskId/attachments` - List attachments for task
- [x] `GET /attachments/:id` - Get attachment by ID
- [x] `DELETE /attachments/:id` - Delete attachment

---

### Comment Management (`/api/comments`)
- [x] `POST /tasks/:taskId/comments` - Add comment to task
- [x] `GET /tasks/:taskId/comments` - List comments for task
- [x] `PATCH /comments/:id` - Update comment
- [x] `DELETE /comments/:id` - Delete comment

---

### Authentication & Authorization
- [x] Implement JWT middleware
- [x] Role-based access control (productOwner, projectManager, teamMember)

---

### API Documentation
- [x] Setup Swagger/OpenAPI documentation
- [x] Document all endpoints with request/response schemas

## Frontend Application


### Authentication & Users
- [x] Login Page
- [x] Register Page
- [x] User Profile Settings

### Projects
- [x] Project List View
- [x] Create Project Modal
- [x] Project Details Page

### Tasks
- [x] Task Board (Kanban view)
- [x] Task List View
- [x] Task Details Modal (with Comments & Attachments)
- [x] Create/Edit Task Modal

### Teams
- [x] Team List View
- [x] Team Details & Member Management

---

## Future MVP Enhancements

### 1. Notifications System
- [ ] In-App Alerts (assigned tasks, mentions, watched tasks)
- [ ] Email Notifications (daily digests, instant alerts)

### 2. Advanced Task Features
- [ ] Subtasks & Epics
- [ ] Activity History / Audit Log on Task Detail Page
- [ ] Rich Text Editor for Descriptions & Comments (TipTap/Quill)
- [ ] Time Tracking (log hours spent)

### 3. Search and Filtering
- [ ] Global Search across application (tasks, projects, users)
- [ ] Advanced Board Filters (assignee, priority, tags, due dates)

### 4. Dashboards & Analytics
- [ ] Reporting (Charts for status distribution, user load)
- [ ] Burndown Charts

### 5. Third-Party Integrations
- [ ] Slack/Discord Webhooks
- [ ] GitHub/GitLab Integration (link PRs to task status)

### 6. User Experience (UX) Enhancements
- [ ] Drag-and-Drop vertical prioritization within Kanban columns
- [ ] User Mentions (@username) in comments

### 7. AI Integrations (Future)
- [ ] **AI Task Breakdown**: Automatically generate subtasks/acceptance criteria from a brief feature description.
- [ ] **AI Project Assistant**: A chat interface to ask questions like "What are the blockers for Project X?"