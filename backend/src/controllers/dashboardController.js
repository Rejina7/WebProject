// src/controllers/dashboardController.js
import { QuizResult } from "../models/QuizResult.js";
import { Quiz } from "../models/Quiz.js";
import { User } from "../models/User.js";
import { sequelize } from "../db.js";
import { getCategories } from "../controllers/quizController.js";

export const getDashboard = async (req, res) => {
  const userId = req.params.userId;
  try {
    // Total quiz categories (for homepage stat)
    const [categories] = await sequelize.query("SELECT COUNT(*) AS count FROM categories");
    const totalQuizzes = categories[0]?.count || 0;

    // Completed quizzes by user
    const completedQuizzes = await QuizResult.count({ where: { userId } });

    // Success rate (percentage of passed quizzes)
    const passedCount = await QuizResult.count({ where: { userId, isPassed: true } });
    const successRate = totalQuizzes > 0 ? Math.round((passedCount / totalQuizzes) * 100) : 0;

    // Active learners (users who have at least one quiz result)
    const activeLearners = await QuizResult.count({ distinct: true, col: 'userId' });

    // Categories
    // Removed duplicate declaration of 'categories' and 'categoryCount'.

    // Recent activities (last 5 quiz results)
    const recentActivities = await QuizResult.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      limit: 5,
      include: [{ model: Quiz, attributes: ["title"] }],
    });

    res.json({
      stats: {
        totalQuizzes,
        completedQuizzes,
        activeLearners,
        categories: categoryCount,
        successRate,
      },
      recentActivities,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};