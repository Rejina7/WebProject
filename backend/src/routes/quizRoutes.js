import express from "express";
import {
  addQuestion,
  getQuizByCategory,
  getCategories,
  updateQuestion,
  deleteQuestion,
  submitQuiz,
  getUserResults
} from "../controllers/quizController.js";

const router = express.Router();

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

export default router;
