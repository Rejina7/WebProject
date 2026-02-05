import express from "express";
import {
  getAllQuizzes,
  getQuizzesByCategory,
  getQuizById,
  createQuiz,
  deleteQuiz,
  updateQuiz,
  getAllQuizzesAdmin,
  submitQuizResult,
  getUserQuizResults,
  getUserDashboardStats,
  getLeaderboard,
  getQuizStatistics,
  getUserQuizStats,
  getRecentAttempts,
} from "../controllers/quizController.js";

const router = express.Router();

// Quiz results endpoints - MUST come before /:id routes
router.post("/submit", submitQuizResult);
router.get("/results/:userId", getUserQuizResults);
router.get("/dashboard/:userId", getUserDashboardStats);
router.get("/leaderboard", getLeaderboard);

// Admin endpoints
router.get("/admin/all", getAllQuizzesAdmin);
router.get("/admin/recent-attempts", getRecentAttempts);
router.get("/admin/stats", getUserQuizStats);
router.get("/admin/statistics/:quizId", getQuizStatistics);
router.get("/admin/statistics", getQuizStatistics);
router.put("/admin/:id", updateQuiz);
router.delete("/admin/:id", deleteQuiz);

// Quiz endpoints
router.get("/", getAllQuizzes);
router.get("/category/:category", getQuizzesByCategory);
router.get("/:id", getQuizById);
router.post("/", createQuiz);

export default router;
