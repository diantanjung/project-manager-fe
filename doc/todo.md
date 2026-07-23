# TODO FE yang Belum Ada

> Turunan dari `../project-manager-laravel/doc/prd-laravel.md`.
> Daftar ini hanya berisi gap yang belum terlihat di `project-manager-fe` saat dokumen dibuat.

## Catatan Scope

- Sudah ada dasar auth, protected route, layout, sidebar, profile, admin users, admin teams, project create dari sidebar, project board, task create/edit, board/list task, comments dasar, attachments dasar, dan notification bell.
- Todo di bawah tidak mengulang fitur tersebut kecuali implementasinya belum sesuai kontrak Laravel API.

## Integrasi Laravel API

- [x] Samakan semua service dengan base API Laravel dari `VITE_API_URL` dan prefix `/api/v1`.
- [x] Samakan semua single-resource response dengan envelope Laravel `{ data: ... }`.
- [x] Samakan semua paginated response dengan envelope `{ data: [], pagination: ... }`.
- [x] Samakan semua form error dengan response Laravel `{ message, errors }`.
- [x] Hapus pemakaian endpoint lama/hardcoded `http://localhost:3000/api`.
- [x] Hapus pemakaian token dari `localStorage` pada service lama yang belum lewat `src/lib/axios.ts`.
- [x] Pastikan refresh token cookie `HttpOnly` berjalan dengan `withCredentials`.
- [x] Tambahkan handler global untuk forbidden `403`, conflict `409`, validation `422`, dan rate limit `429`.
- [x] Tambahkan tipe reusable untuk `ApiResource<T>`, `PaginatedResource<T>`, dan `ApiValidationError`.
- [ ] Tambahkan endpoint Laravel atau adapter FE untuk `/users`, `/users/{user}/avatar`, `/teams/{team}/members`, dan assignment team project karena route tersebut belum terlihat di `../project-manager-laravel/routes/api.php`.
- [ ] Ganti filter client-side sementara untuk task/comment/attachment per task menjadi query backend atau nested endpoint saat kontrak Laravel tersedia.
- [ ] Ganti placeholder `file_url` pada attachment create dengan upload/download flow backend yang benar.

## Dashboard

- [ ] Ganti dashboard statis dengan data dari `GET /api/v1/dashboard`.
- [ ] Tampilkan total active projects.
- [ ] Tampilkan task count per status.
- [ ] Tampilkan overdue task count.
- [ ] Tampilkan workload per member.
- [ ] Tampilkan recently updated tasks.
- [ ] Tampilkan blocked tasks.
- [ ] Tambahkan loading, empty, dan error state untuk dashboard.

## Project Management

- [ ] Tambahkan halaman daftar project penuh, bukan hanya list project di sidebar.
- [ ] Tambahkan search project.
- [ ] Tambahkan filter project berdasarkan status, team, dan owner.
- [ ] Tambahkan sort project.
- [ ] Tambahkan pagination project.
- [ ] Tambahkan edit project.
- [ ] Tambahkan delete/archive project.
- [ ] Tambahkan halaman/detail project overview.
- [ ] Tampilkan summary task count per status dari `GET /api/v1/projects/{project}/summary`.
- [ ] Tampilkan owner, primary team, status, start date, dan due date project.
- [ ] Tambahkan manage additional teams lewat endpoint project-team assignment.
- [ ] Tambahkan tab project: Overview, Tasks, Activity, Teams.
- [ ] Handle forbidden state saat user tidak punya akses ke project.

## Task List dan Kanban

- [ ] Tambahkan halaman task global dari `GET /api/v1/tasks`.
- [ ] Tambahkan filter task berdasarkan project, status, priority, assignee, due date, dan search.
- [ ] Tambahkan sort task.
- [ ] Tambahkan pagination task list.
- [ ] Ganti reorder/status drag-drop agar memakai endpoint atomik `POST /api/v1/tasks/reorder`.
- [ ] Tambahkan rollback optimistic UI yang benar saat reorder/status update gagal.
- [ ] Disable drag-drop/reorder berdasarkan permission role.
- [ ] Tampilkan blocked indicator yang berasal dari dependency backend.
- [ ] Tampilkan estimate minutes dan completed date bila tersedia.

## Task Detail

- [ ] Fetch detail task penuh dari `GET /api/v1/tasks/{task}` saat dialog dibuka.
- [ ] Tampilkan creator.
- [ ] Tampilkan primary assignee dan additional assignees.
- [ ] Tambahkan add/remove additional assignee.
- [ ] Tampilkan estimate minutes.
- [ ] Tampilkan completed date.
- [ ] Tambahkan section activity dari `GET /api/v1/tasks/{task}/activity`.
- [ ] Tambahkan validasi visual saat task tidak bisa masuk `done` karena dependency belum selesai.

## Checklist dan Dependency

- [ ] Tambahkan tipe, service, dan store untuk checklist item.
- [ ] Tambah checklist item via `POST /api/v1/tasks/{task}/checklist-items`.
- [ ] Update checklist item via `PATCH /api/v1/checklist-items/{item}`.
- [ ] Delete checklist item via `DELETE /api/v1/checklist-items/{item}`.
- [ ] Tampilkan progress checklist di task detail.
- [ ] Tambahkan tipe, service, dan store untuk task dependency.
- [ ] Tambah dependency via `POST /api/v1/tasks/{task}/dependencies`.
- [ ] Hapus dependency via `DELETE /api/v1/tasks/{task}/dependencies/{dependency}`.
- [ ] Tampilkan dependency/blocker di task detail, task card, dan project summary.

## Comments dan Mention

- [ ] Tambahkan edit comment milik sendiri.
- [ ] Tambahkan highlight mention `@name` di comment body.
- [ ] Tambahkan mention suggestion jika backend menyediakan daftar user/project member.
- [ ] Tampilkan sending/error state per comment saat create/update/delete.
- [ ] Pastikan create/update comment mengikuti envelope Laravel.

## Attachments dan Avatar

- [ ] Pindahkan `attachment.service.ts` ke `src/lib/axios.ts` dan `VITE_API_URL`.
- [ ] Samakan field attachment dengan Laravel: `originalName`, `mimeType`, `size`, `uploaderId`, `createdAt`.
- [ ] Upload attachment ke `POST /api/v1/tasks/{task}/attachments`.
- [ ] Download attachment lewat `GET /api/v1/attachments/{attachment}/download`.
- [ ] Handle response download berupa signed URL, redirect URL, atau blob sesuai kontrak backend.
- [ ] Validasi FE untuk tipe file MVP: image, PDF, text, zip.
- [ ] Validasi ukuran file sesuai config/response backend.
- [ ] Tampilkan upload progress.
- [ ] Tambahkan preview image/PDF bila backend mengizinkan.
- [ ] Ganti upload avatar profile agar memakai `POST /api/v1/users/{user}/avatar`.
- [ ] Tambahkan preview avatar sebelum upload.

## Notifications

- [ ] Tambahkan halaman notification penuh, tidak hanya popover.
- [ ] Tambahkan deeplink notification ke task/project terkait.
- [ ] Tambahkan rendering untuk semua tipe: `task_assigned`, `mention`, `task_due`, `project_update`, `system_alert`.
- [ ] Pastikan unread state memakai `readAt` dari backend jika kontrak Laravel tidak memakai `isRead`.
- [ ] Tambahkan pagination/infinite scroll bila endpoint notification mengembalikan pagination.

## Activity Log dan Audit

- [ ] Tambahkan project activity dari `GET /api/v1/projects/{project}/activity`.
- [ ] Tambahkan task activity dari `GET /api/v1/tasks/{task}/activity`.
- [ ] Tambahkan halaman admin audit log dari `GET /api/v1/activity-logs`.
- [ ] Tambahkan filter audit log berdasarkan entity, actor, action, dan date range bila didukung backend.
- [ ] Render perubahan `before` dan `after` dengan format yang mudah dibaca.
- [ ] Tampilkan IP address dan user agent hanya di audit/admin context.

## Export dan Reporting

- [ ] Tambahkan tombol export project report via `POST /api/v1/exports/project-report`.
- [ ] Tambahkan service/status export dari `GET /api/v1/exports/{export}`.
- [ ] Tambahkan polling saat export masih diproses job.
- [ ] Tambahkan download export saat file siap.
- [ ] Tampilkan failure reason saat export gagal.
- [ ] Tambahkan export task list dengan filter aktif bila endpoint backend tersedia.

## Webhook dan Integrasi Admin

- [ ] Tambahkan halaman admin webhook endpoints.
- [ ] CRUD webhook endpoint via `/api/v1/webhook-endpoints`.
- [ ] Tambahkan multi-select event berdasarkan enum `WebhookEvent`.
- [ ] Tambahkan active/inactive toggle.
- [ ] Tambahkan halaman/list webhook deliveries dari `GET /api/v1/webhook-deliveries`.
- [ ] Tampilkan status delivery, attempt count, last error, dan delivered date.

## Saved Filters dan Public Share

- [ ] Tambahkan saved filters untuk project/task list bila endpoint backend tersedia.
- [ ] Tambahkan UI simpan, pilih, edit, dan hapus saved filter.
- [ ] Tambahkan public share link untuk project report bila endpoint backend tersedia.
- [ ] Tambahkan public report page dengan data terbatas.

## Polish dan Reliability

- [ ] Tambahkan empty state konsisten untuk list project, task, user, team, comment, attachment, notification, audit.
- [ ] Tambahkan skeleton/loading state konsisten untuk halaman data utama.
- [ ] Tambahkan confirmation dialog reusable sebagai pengganti `window.confirm`.
- [ ] Tambahkan role-aware visibility untuk action create/edit/delete/reorder/manage member/manage webhook.
- [ ] Tambahkan toast/surface error global untuk mutation gagal.
- [ ] Tambahkan responsive pass untuk dashboard, board, dialogs, admin tables, dan sidebar.
- [ ] Tambahkan smoke test manual untuk login demo, create project, create task, drag task, comment, attachment, notification.
