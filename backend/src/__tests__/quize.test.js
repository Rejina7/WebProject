import request from "supertest";
import app from "../app.js";
import { sequelize } from "../db.js";

describe("Quiz API", () => {
  let testQuizId;
  const testQuiz = {
    title: "Sample Quiz",
    category: "Science",
    totalQuestions: 5,
  };

  afterAll(async () => {
    await sequelize.query("DELETE FROM quizzes WHERE title = :title", {
      replacements: { title: testQuiz.title },
    });
    await sequelize.close();
  });

  test("POST /api/quizzes - create quiz", async () => {
    const res = await request(app).post("/api/quizzes").send(testQuiz);
    expect(res.statusCode).toBe(201);
    expect(res.body.quiz.title).toBe(testQuiz.title);
    testQuizId = res.body.quiz.id;
  });

  test("GET /api/quizzes/admin/all - get all quizzes", async () => {
    const res = await request(app).get("/api/quizzes/admin/all");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.quizzes)).toBe(true);
  });
});