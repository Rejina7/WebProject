import express from "express";
import {
  addQuestion,
  getQuizByCategory,
  getCategories,
  updateQuestion,
  deleteQuestion,
  submitQuiz,
  getUserResults,
  getUserDashboardStats,
  getAllQuizzesAdmin,
  createQuiz
} from "../controllers/quizController.js";

const router = express.Router();

// user dashboard stats
router.get("/dashboard/:userId", getUserDashboardStats);

// categories
router.get("/categories", getCategories);

// questions
router.post("/questions", addQuestion);
router.get("/questions/:categoryId", getQuizByCategory);
router.put("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);

// quiz
router.post("/submit", submitQuiz);
router.get("/results/:userId", getUserResults);

// Admin: get all quizzes
router.get("/admin/all", getAllQuizzesAdmin);
// Admin: create quiz
router.post("/", createQuiz);

export default router;
