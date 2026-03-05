import request from "supertest";
import app from "../app.js";

describe("Dashboard API", () => {
  const userId = 1; // use a valid user ID from your DB

  test("GET /api/dashboard/:userId - fetch stats", async () => {
    const res = await request(app).get(`/api/dashboard/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.stats).toHaveProperty("totalQuizzes");
    expect(res.body.stats).toHaveProperty("completedQuizzes");
  });
});