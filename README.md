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

## Member 4 — Live Feed & User Discovery

The Member 4 dashboard brings posts and social connections together in one interface. It loads posts from the API and gives logged-in users a place to browse people, check their followers and following, and manage follow connections.

### What’s included

- **Live post feed:** Displays posts loaded from `GET /posts`, including captions, images, hashtags, authors, timestamps, likes, and comments.
- **People discovery:** Lists users from `GET /users` and shows follower and following counts.
- **Follower and following lists:** Opens a panel for viewing the signed-in user’s followers and the accounts they follow.
- **Follow controls:** Lets users follow, follow back, and unfollow from the discovery and profile panels.
- **Profile summary:** Shows the signed-in user’s username, bio, and follower/following counts.

### API routes used by the feed and discovery interface

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/posts` | Load posts for the live feed |
| `GET` | `/users` | Load accounts for discovery |
| `GET` | `/users/:id` | Load a user’s profile details |
| `GET` | `/users/:id/followers` | Load a user’s followers |
| `GET` | `/users/:id/following` | Load accounts a user follows |
| `POST` | `/users/:id/follow` | Follow a user or send a follow request |
| `DELETE` | `/users/:id/follow` | Unfollow a user |

The dashboard is in [`public/index.html`](public/index.html) and connects to the project API to display live data.

### Real-Time Socket.IO Events
- **Handshake Auth:** `{ auth: { token: "<JWT>" } }` (automatically joins room `user:<userId>`).
- **Incoming Event:** `notification:new` — delivers real-time JSON payload on likes, comments, and follows.
- **Service Helpers:** `notifyLike(actorId, recipientId, postId)`, `notifyComment(actorId, recipientId, postId, commentId)`, `notifyFollow(actorId, recipientId)`.
