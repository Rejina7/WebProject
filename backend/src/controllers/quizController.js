import { sequelize } from "../db.js";

// Get all quizzes
export const getAllQuizzes = async (req, res) => {
  try {
    const [quizzes] = await sequelize.query(
      "SELECT * FROM quizzes WHERE \"isActive\" = true ORDER BY \"createdAt\" DESC"
    );
    res.json({
      message: "Quizzes retrieved successfully",
      quizzes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get quiz by category
export const getQuizzesByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const [quizzes] = await sequelize.query(
      "SELECT * FROM quizzes WHERE category = :category AND \"isActive\" = true ORDER BY \"createdAt\" DESC",
      { replacements: { category } }
    );
    res.json({
      message: "Quizzes retrieved successfully",
      quizzes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single quiz
export const getQuizById = async (req, res) => {
  const { id } = req.params;

  try {
    const [quiz] = await sequelize.query(
      "SELECT * FROM quizzes WHERE id = :id",
      { replacements: { id } }
    );

    if (quiz.length === 0) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json({
      message: "Quiz retrieved successfully",
      quiz: quiz[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create quiz (admin only)
export const createQuiz = async (req, res) => {
  const { title, description, category, difficulty, timeLimit, totalQuestions, passingScore } = req.body;

  try {
    const [result] = await sequelize.query(
      `INSERT INTO quizzes (title, description, category, difficulty, "timeLimit", "totalQuestions", "passingScore", "isActive")
       VALUES (:title, :description, :category, :difficulty, :timeLimit, :totalQuestions, :passingScore, true)
       RETURNING *`,
      {
        replacements: {
          title,
          description,
          category,
          difficulty: difficulty || "medium",
          timeLimit: timeLimit || 300,
          totalQuestions,
          passingScore: passingScore || 60,
        },
      }
    );

    res.status(201).json({
      message: "Quiz created successfully",
      quiz: result[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update quiz result/score
export const submitQuizResult = async (req, res) => {
  const { userId, quizId, score, totalQuestions, correctAnswers, timeTaken } = req.body;

  try {
    // Get passing score
    const [quizData] = await sequelize.query(
      "SELECT \"passingScore\" FROM quizzes WHERE id = :quizId",
      { replacements: { quizId } }
    );

    if (quizData.length === 0) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const passingScore = quizData[0].passingScore;
    const isPassed = score >= passingScore;

    const [result] = await sequelize.query(
      `INSERT INTO quiz_results (\"userId\", \"quizId\", score, \"totalQuestions\", \"correctAnswers\", \"timeTaken\", \"isPassed\")
       VALUES (:userId, :quizId, :score, :totalQuestions, :correctAnswers, :timeTaken, :isPassed)
       RETURNING *`,
      {
        replacements: {
          userId,
          quizId,
          score,
          totalQuestions,
          correctAnswers,
          timeTaken,
          isPassed,
        },
      }
    );

    res.status(201).json({
      message: "Quiz result submitted successfully",
      result: result[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's quiz results
export const getUserQuizResults = async (req, res) => {
  const { userId } = req.params;

  try {
    const [results] = await sequelize.query(
      `SELECT qr.*, q.title, q.category 
       FROM quiz_results qr
       JOIN quizzes q ON qr."quizId" = q.id
       WHERE qr."userId" = :userId
       ORDER BY qr."createdAt" DESC`,
      { replacements: { userId } }
    );

    res.json({
      message: "User quiz results retrieved",
      results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get leaderboard
export const getLeaderboard = async (req, res) => {
  const { quizId } = req.query;

  try {
    let query = `
      SELECT u.id, u.username, u.email, 
             AVG(qr.score) as avgScore, 
             COUNT(qr.id) as quizzesAttempted,
             SUM(CASE WHEN qr."isPassed" = true THEN 1 ELSE 0 END) as quizzesPassed,
             MAX(qr.score) as highestScore
      FROM users u
      LEFT JOIN quiz_results qr ON u.id = qr."userId"
    `;

    let replacements = {};

    if (quizId) {
      query += ` WHERE qr."quizId" = :quizId`;
      replacements.quizId = quizId;
    }

    query += `
      GROUP BY u.id, u.username, u.email
      ORDER BY avgScore DESC, quizzesAttempted DESC
      LIMIT 100
    `;

    const [leaderboard] = await sequelize.query(query, { replacements });

    res.json({
      message: "Leaderboard retrieved successfully",
      leaderboard,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
