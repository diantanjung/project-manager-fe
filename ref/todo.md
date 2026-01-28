# Todo - January 13, 2026

## Frontend

- [x] Complete Router setup (`react-router`)
  - [x] Configure public routes (`/login`)
  - [ ] Configure protected routes (`/`, `/projects/:projectId`, `/team`)
  - [x] Implement route guards with JWT auth state
- [/] Setup `zustand` stores structure
  - [x] Create `authStore` (user, accessToken, auth status)
  - [ ] Create `projectStore`
  - [ ] Create `uiStore`
- [x] Configure Axios interceptors
  - [x] Attach JWT to requests
  - [x] Handle token expiration and refresh

## Backend

- [x] Implement JWT refresh token endpoint
  - [x] Create `/api/auth/refresh` route
  - [x] Add refresh token logic
  - [ ] Update Swagger documentation
- [x] Implement JWT logout endpoint
  - [x] Create `/api/auth/logout` route
  - [x] Add token invalidation logic
  - [ ] Update Swagger documentation
- [x] Create JWT verification middleware
  - [x] Implement middleware to protect private routes
  - [x] Apply to protected endpoints

## Testing & Verification

- [ ] Test login flow (frontend → backend)
- [ ] Test token refresh flow
- [ ] Test protected route access
- [ ] Verify Swagger documentation is accurate
