import express from "express";
import {
  getAllQuizzes,
  getQuizzesByCategory,
  getQuizById,
  createQuiz,
  submitQuizResult,
  getUserQuizResults,
  getLeaderboard,
} from "../controllers/quizController.js";

const router = express.Router();

// Quiz endpoints
router.get("/", getAllQuizzes);
router.get("/category/:category", getQuizzesByCategory);
router.get("/:id", getQuizById);
router.post("/", createQuiz);

// Quiz results endpoints
router.post("/submit", submitQuizResult);
router.get("/results/:userId", getUserQuizResults);

// Leaderboard
router.get("/leaderboard", getLeaderboard);

export default router;
