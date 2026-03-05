import { Quiz } from "../models/Quiz.js";
import { QuizResult } from "../models/QuizResult.js";
import User from "../models/User.js";

export const getHomepage = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Total quizzes
    const totalQuizzes = await Quiz.count();

    // Completed quizzes by this user
    const completedQuizzes = await QuizResult.count({ where: { userId } });

    // Total users (active learners)
    const activeLearners = await User.count({ where: { role: "user" } });

    // Calculate success rate for this user
    const passed = await QuizResult.count({ where: { userId, isPassed: true } });
    const successRate = completedQuizzes > 0 ? Math.round((passed / completedQuizzes) * 100) : 0;

    res.json({
      stats: {
        totalQuizzes,
        completedQuizzes,
        activeLearners,
        successRate
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error loading homepage data" });
  }
};