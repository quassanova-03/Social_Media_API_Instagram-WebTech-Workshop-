import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";
import { authenticate } from "./middleware";

const router = Router();

function makeToken(user: { id: string; role: string }) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );
}

// POST /auth/register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body || {};

  if (!username || !email || !password) {
    return res.status(400).json({ error: "username, email and password are required" });
  }
  if (!email.includes("@")) {
    return res.status(400).json({ error: "Invalid email" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const exists = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (exists) {
    return res.status(409).json({ error: "Email or username already taken" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, email, passwordHash },
  });

  res.status(201).json({
    token: makeToken(user),
    user: { id: user.id, username: user.username, email: user.email, role: user.role },
  });
});

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  res.json({
    token: makeToken(user),
    user: { id: user.id, username: user.username, email: user.email, role: user.role },
  });
});

// GET /auth/me  (needs token)
router.get("/me", authenticate, async (req: any, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, username: true, email: true, role: true, createdAt: true },
  });
  res.json({ user });
});

export default router;
