import { it, expect, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/server";
import { prisma } from "../src/prisma";

const id = Date.now();
const user = { username: `test${id}`, email: `test${id}@example.com`, password: "secret123" };

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: user.email } });
  await prisma.$disconnect();
});

it("registers a user", async () => {
  const res = await request(app).post("/auth/register").send(user);
  expect(res.status).toBe(201);
  expect(res.body.token).toBeDefined();
});

it("rejects a duplicate email", async () => {
  const res = await request(app).post("/auth/register").send(user);
  expect(res.status).toBe(409);
});

it("rejects bad input", async () => {
  const res = await request(app).post("/auth/register").send({ email: "x" });
  expect(res.status).toBe(400);
});

it("logs in and rejects a wrong password", async () => {
  const ok = await request(app).post("/auth/login").send(user);
  expect(ok.status).toBe(200);

  const bad = await request(app).post("/auth/login").send({ ...user, password: "wrong" });
  expect(bad.status).toBe(401);
});

it("protects /auth/me", async () => {
  const noToken = await request(app).get("/auth/me");
  expect(noToken.status).toBe(401);

  const login = await request(app).post("/auth/login").send(user);
  const me = await request(app)
    .get("/auth/me")
    .set("Authorization", `Bearer ${login.body.token}`);
  expect(me.status).toBe(200);
  expect(me.body.user.email).toBe(user.email);
});

it("blocks normal users from admin routes", async () => {
  const login = await request(app).post("/auth/login").send(user);
  const res = await request(app)
    .get("/admin/ping")
    .set("Authorization", `Bearer ${login.body.token}`);
  expect(res.status).toBe(403);
});
