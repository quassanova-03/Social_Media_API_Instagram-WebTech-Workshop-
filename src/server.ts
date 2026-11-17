import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./authRoutes";
import { authenticate, adminOnly } from "./middleware";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

// Example admin-only route. Teammates can protect theirs the same way.
app.get("/admin/ping", authenticate, adminOnly, (req, res) => {
  res.json({ message: "Hello admin" });
});

// Don't start the server when running tests
if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => console.log("Server running on http://localhost:3000"));
}
