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
  // Handle both { data: {...} } and direct {...} formats
  const bodyData = req.body.data || req.body;
  const { userId, quizId, score, totalQuestions, correctAnswers, timeTaken, isPassed, category, title } = bodyData;

  console.log("Quiz submission received:", req.body);
  console.log("Extracted data:", bodyData);
  console.log("userId:", userId, "quizId:", quizId, "score:", score, "category:", category);

  try {
    if (!userId) {
      console.error("Missing userId");
      return res.status(400).json({ message: "userId is required" });
    }

    let quizRecordId = quizId;
    let passingScore = 60;

    if (quizRecordId) {
      const [quizData] = await sequelize.query(
        "SELECT \"passingScore\" FROM quizzes WHERE id = :quizId",
        { replacements: { quizId: quizRecordId } }
      );

      if (quizData.length === 0) {
        console.log("Quiz not found by ID, will create new one");
        quizRecordId = null;
      } else {
        passingScore = quizData[0].passingScore;
      }
    }

    // If quiz not found, create a quiz from category/title
    if (!quizRecordId) {
      if (!category || !totalQuestions) {
        return res.status(404).json({ message: "Quiz not found and category/totalQuestions required" });
      }

      console.log("Creating new quiz for category:", category);

      const [createdQuiz] = await sequelize.query(
        `INSERT INTO quizzes (title, description, category, difficulty, "timeLimit", "totalQuestions", "passingScore", "isActive", "createdAt", "updatedAt")
         VALUES (:title, :description, :category, :difficulty, :timeLimit, :totalQuestions, :passingScore, true, NOW(), NOW())
         RETURNING id, "passingScore"`,
        {
          replacements: {
            title: title || `${category} Quiz`,
            description: null,
            category,
            difficulty: "medium",
            timeLimit: 300,
            totalQuestions,
            passingScore: 60,
          },
        }
      );

      quizRecordId = createdQuiz[0].id;
      passingScore = createdQuiz[0].passingScore || 60;
      console.log("Created quiz with ID:", quizRecordId);
    }

    const passStatus = isPassed !== undefined ? isPassed : score >= passingScore;

    console.log("Inserting quiz result - userId:", userId, "quizId:", quizRecordId, "score:", score);

    const [result] = await sequelize.query(
      `INSERT INTO quiz_results ("userId", "quizId", score, "totalQuestions", "correctAnswers", "timeTaken", "isPassed", "createdAt")
       VALUES (:userId, :quizId, :score, :totalQuestions, :correctAnswers, :timeTaken, :isPassed, NOW())
       RETURNING *`,
      {
        replacements: {
          userId,
          quizId: quizRecordId,
          score,
          totalQuestions,
          correctAnswers,
          timeTaken,
          isPassed: passStatus,
        },
      }
    );

    console.log("Quiz result inserted:", result[0]);

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

// Get user dashboard statistics
export const getUserDashboardStats = async (req, res) => {
  const { userId } = req.params;
  
  console.log("📊 Fetching dashboard stats for userId:", userId);

  try {
    // Get total quizzes available
    const [totalQuizzes] = await sequelize.query(
      "SELECT COUNT(*) as count FROM quizzes WHERE \"isActive\" = true"
    );

    // Get user's quiz attempts count
    const [completedQuizzes] = await sequelize.query(
      'SELECT COUNT(*) as count FROM quiz_results WHERE "userId" = :userId',
      { replacements: { userId } }
    );

    // Get total active learners (all users)
    const [activeLearners] = await sequelize.query(
      "SELECT COUNT(*) as count FROM users"
    );

    // Get user's success rate
    const [successRate] = await sequelize.query(
      `SELECT 
        COUNT(CASE WHEN "isPassed" = true THEN 1 END)::float / 
        NULLIF(COUNT(*)::float, 0) * 100 as rate
       FROM quiz_results 
       WHERE "userId" = :userId`,
      { replacements: { userId } }
    );

    // Get average score percentage
    const [avgScore] = await sequelize.query(
      `SELECT 
        AVG(CAST(score AS FLOAT)) as average
       FROM quiz_results 
       WHERE "userId" = :userId`,
      { replacements: { userId } }
    );

    // Get total points
    const [totalPoints] = await sequelize.query(
      `SELECT COALESCE(SUM(score), 0) as points
       FROM quiz_results 
       WHERE "userId" = :userId`,
      { replacements: { userId } }
    );

    // Calculate current streak (simplified - days with quiz attempts)
    const [streakData] = await sequelize.query(
      `SELECT COUNT(DISTINCT DATE("createdAt")) as streak
       FROM quiz_results 
       WHERE "userId" = :userId 
       AND "createdAt" >= NOW() - INTERVAL '30 days'`,
      { replacements: { userId } }
    );

    // Get recent activities (last 5 quiz attempts)
    const [recentActivities] = await sequelize.query(
      `SELECT qr.*, q.title, q.category 
       FROM quiz_results qr
       JOIN quizzes q ON qr."quizId" = q.id
       WHERE qr."userId" = :userId
       ORDER BY qr."createdAt" DESC
       LIMIT 5`,
      { replacements: { userId } }
    );

    res.json({
      message: "Dashboard stats retrieved successfully",
      stats: {
        totalQuizzes: parseInt(totalQuizzes[0].count) || 0,
        completedQuizzes: parseInt(completedQuizzes[0].count) || 0,
        activeLearners: parseInt(activeLearners[0].count) || 0,
        successRate: parseFloat(successRate[0].rate) || 0,
        averageScore: parseFloat(avgScore[0].average) || 0,
        totalPoints: parseInt(totalPoints[0].points) || 0,
        currentStreak: parseInt(streakData[0].streak) || 0,
      },
      recentActivities,
    });
    
    console.log("✅ Stats sent:", {
      completedQuizzes: parseInt(completedQuizzes[0].count) || 0,
      averageScore: parseFloat(avgScore[0].average) || 0,
      totalPoints: parseInt(totalPoints[0].points) || 0,
      currentStreak: parseInt(streakData[0].streak) || 0,
    });
  } catch (err) {
    console.error("Quiz submission error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
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
