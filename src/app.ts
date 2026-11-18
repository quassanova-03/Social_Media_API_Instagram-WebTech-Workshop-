import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import postRoutes from "./routes/post.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/posts", postRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "Social Media API is running" });
});

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});