import express from "express";
import {
  getAllQuizzes,
  getQuizzesByCategory,
  getQuizById,
  createQuiz,
  submitQuizResult,
  getUserQuizResults,
  getUserDashboardStats,
  getLeaderboard,
} from "../controllers/quizController.js";

const router = express.Router();

// Quiz results endpoints - MUST come before /:id routes
router.post("/submit", submitQuizResult);
router.get("/results/:userId", getUserQuizResults);
router.get("/dashboard/:userId", getUserDashboardStats);
router.get("/leaderboard", getLeaderboard);

// Quiz endpoints
router.get("/", getAllQuizzes);
router.get("/category/:category", getQuizzesByCategory);
router.get("/:id", getQuizById);
router.post("/", createQuiz);

export default router;
