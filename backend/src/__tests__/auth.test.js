// src/__tests__/auth.test.js
import request from "supertest";
import app from "../app.js";
import { sequelize } from "../db.js";

describe("Auth API", () => {
  // Generate a unique email each time
  const timestamp = Date.now();
  const testUser = {
    username: `Rejina${timestamp}`,
    email: `rej${timestamp}@example.com`,
    password: "123456789",
  };

  afterAll(async () => {
    // Cleanup: delete the test user
    try {
      await sequelize.query("DELETE FROM users WHERE email = :email", {
        replacements: { email: testUser.email },
      });
    } catch (err) {
      console.log("Cleanup error:", err);
    }
    await sequelize.close();
  });

  test("POST /api/auth/signup - success", async () => {
    const res = await request(app).post("/api/auth/signup").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.username).toBe(testUser.username);
    expect(res.body.user.email).toBe(testUser.email);
  });

  test("POST /api/auth/signup - duplicate email", async () => {
    // First, create the user
    await request(app).post("/api/auth/signup").send(testUser);
    // Try signing up again with the same email
    const res = await request(app).post("/api/auth/signup").send(testUser);
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/Email already exists|Username already taken/);
  });

  test("POST /api/auth/login - success", async () => {
    // Ensure the user exists
    await request(app).post("/api/auth/signup").send(testUser);

    const res = await request(app).post("/api/auth/login").send({
      username: testUser.username,
      password: testUser.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token"); // token is required now
    expect(res.body.user.username).toBe(testUser.username);
  });

  test("POST /api/auth/login - wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      username: testUser.username,
      password: "wrongpass",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid credentials"); // must match new controller
  });
});