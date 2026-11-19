# Social Media REST API & Real-Time Notification Engine

Backend API for an Instagram-style social media platform built with **Node.js, Express, TypeScript, Prisma ORM, Supabase PostgreSQL, JWT Authentication, and Socket.IO**.

## Tech Stack
- **Runtime & Framework:** Node.js, Express 5, TypeScript
- **Database & ORM:** PostgreSQL (Supabase), Prisma ORM v5
- **Real-Time Engine:** Socket.IO v4 (JWT-authenticated user rooms)
- **Authentication:** JSON Web Tokens (JWT) & Role-Based Access Control (`USER` / `ADMIN`)

## Local Setup
1. Clone the repository: `git clone https://github.com/quassanova-03/Social_Media_API_Instagram-WebTech-Workshop-.git`
2. Create a `.env` file with `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, and `PORT=5000`.
3. Install & run: `npm install && npx prisma generate && npm run dev`

## Member 5 Endpoints (Notifications, Real-Time Socket.IO & Admin Moderation)

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | Verify server health status |
| `GET` | `/notifications?limit=20&offset=0` | `Bearer <JWT>` | Fetch paginated notifications for logged-in user |
| `PATCH` | `/notifications/:id/read` | `Bearer <JWT>` | Acknowledge and dismiss a single notification |
| `PATCH` | `/notifications/read-all` | `Bearer <JWT>` | Clear all notifications for logged-in user |
| `POST` | `/notifications/test-trigger` | `Bearer <JWT>` | Trigger a `LIKE`, `COMMENT`, `FOLLOW`, or `SYSTEM` alert |
| `POST` | `/reports` | `Bearer <JWT>` | Report a post (`{ "postId": "<UUID>" }`) |
| `GET` | `/admin/reports?limit=20&offset=0` | `Bearer <ADMIN_JWT>` | List all reported posts with reporter & post details |
| `PATCH` | `/admin/reports/:id` | `Bearer <ADMIN_JWT>` | Dismiss/resolve a specific report |
| `PATCH` | `/admin/posts/:id` | `Bearer <ADMIN_JWT>` | Moderate post (`{ "action": "DELETE" | "DISMISS_REPORTS" }`) |
| `DELETE` | `/admin/posts/:id` | `Bearer <ADMIN_JWT>` | Permanently remove a violating post |

### Real-Time Socket.IO Events
- **Handshake Auth:** `{ auth: { token: "<JWT>" } }` (automatically joins room `user:<userId>`).
- **Incoming Event:** `notification:new` — delivers real-time JSON payload on likes, comments, and follows.
- **Service Helpers:** `notifyLike(actorId, recipientId, postId)`, `notifyComment(actorId, recipientId, postId, commentId)`, `notifyFollow(actorId, recipientId)`.
