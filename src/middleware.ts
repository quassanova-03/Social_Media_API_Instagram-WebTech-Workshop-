import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Checks the token. Use on any route that needs a logged-in user.
export function authenticate(req: any, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Login required" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET as string);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Use after authenticate. Only lets admins through.
export function adminOnly(req: any, res: Response, next: NextFunction) {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Admins only" });
  }
  next();
}
