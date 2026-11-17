-- ==========================================
-- 0. CLEANUP (removes leftovers from earlier runs)
-- WARNING: this deletes all data in these tables
-- ==========================================
DROP TABLE IF EXISTS "Report" CASCADE;
DROP TABLE IF EXISTS "Notification" CASCADE;
DROP TABLE IF EXISTS "Follow" CASCADE;
DROP TABLE IF EXISTS "Like" CASCADE;
DROP TABLE IF EXISTS "Comment" CASCADE;
DROP TABLE IF EXISTS "Post" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TYPE IF EXISTS "ReportStatus";
DROP TYPE IF EXISTS "NotificationType";
DROP TYPE IF EXISTS "Role";

-- ==========================================
-- 1. ENUMS
-- ==========================================
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

CREATE TYPE "NotificationType" AS ENUM (
  'LIKE',
  'COMMENT',
  'FOLLOW',
  'MENTION',
  'SYSTEM'
);

CREATE TYPE "ReportStatus" AS ENUM (
  'PENDING',
  'RESOLVED',
  'DISMISSED'
);

-- ==========================================
-- 2. TABLES
-- ==========================================

-- Users
CREATE TABLE "User" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "username" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'USER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "User_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "User_username_key" UNIQUE ("username"),
  CONSTRAINT "User_email_key" UNIQUE ("email")
);

-- Posts
CREATE TABLE "Post" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "content" TEXT NOT NULL,
  "isHidden" BOOLEAN NOT NULL DEFAULT false,
  "authorId" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Post_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId")
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Comments
CREATE TABLE "Comment" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "content" TEXT NOT NULL,
  "postId" UUID NOT NULL,
  "authorId" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Comment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId")
    REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId")
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Likes (one like per user per post)
CREATE TABLE "Like" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "postId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Like_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Like_userId_postId_key" UNIQUE ("userId", "postId"),
  CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId")
    REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Follows (follower follows following)
CREATE TABLE "Follow" (
  "followerId" UUID NOT NULL,
  "followingId" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Follow_pkey" PRIMARY KEY ("followerId", "followingId"),
  CONSTRAINT "Follow_no_self_follow" CHECK ("followerId" <> "followingId"),
  CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId")
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId")
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Notifications
CREATE TABLE "Notification" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "type" "NotificationType" NOT NULL,
  "message" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "userId" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Reports (users report posts, admins resolve them)
CREATE TABLE "Report" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "reason" TEXT NOT NULL,
  "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
  "postId" UUID NOT NULL,
  "reporterId" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Report_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Report_postId_fkey" FOREIGN KEY ("postId")
    REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId")
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ==========================================
-- 3. INDEXES (faster feed and lookups)
-- ==========================================
CREATE INDEX "Post_authorId_createdAt_idx" ON "Post"("authorId", "createdAt");
CREATE INDEX "Comment_postId_idx" ON "Comment"("postId");
CREATE INDEX "Follow_followingId_idx" ON "Follow"("followingId");
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");
