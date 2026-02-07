import { sequelize } from "../db.js";

// Get all feedback
export const getAllFeedback = async (req, res) => {
  try {
    const [feedback] = await sequelize.query(
      `SELECT f.*, u.username, u.email, p.name as productName,
              COALESCE(q.title, f."quizTitle") as "quizTitle",
              COALESCE(q.category, f."quizCategory") as "quizCategory"
       FROM feedbacks f
       JOIN users u ON f."userId" = u.id
       LEFT JOIN products p ON f."productId" = p.id
       LEFT JOIN quizzes q ON f."quizId" = q.id
       ORDER BY f."createdAt" DESC`
    );
    res.json({
      message: "Feedback retrieved successfully",
      feedback,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get feedback for product
export const getFeedbackByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const [feedback] = await sequelize.query(
      `SELECT f.*, u.username, u.email,
              COALESCE(q.title, f."quizTitle") as "quizTitle",
              COALESCE(q.category, f."quizCategory") as "quizCategory"
       FROM feedbacks f
       JOIN users u ON f."userId" = u.id
       LEFT JOIN quizzes q ON f."quizId" = q.id
       WHERE f."productId" = :productId
       ORDER BY f."createdAt" DESC`,
      { replacements: { productId } }
    );
    res.json({
      message: "Product feedback retrieved successfully",
      feedback,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get feedback by user
export const getFeedbackByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const [feedback] = await sequelize.query(
      `SELECT f.*, p.name as productName,
              COALESCE(q.title, f."quizTitle") as "quizTitle",
              COALESCE(q.category, f."quizCategory") as "quizCategory"
       FROM feedbacks f
       LEFT JOIN products p ON f."productId" = p.id
       LEFT JOIN quizzes q ON f."quizId" = q.id
       WHERE f."userId" = :userId
       ORDER BY f."createdAt" DESC`,
      { replacements: { userId } }
    );
    res.json({
      message: "User feedback retrieved successfully",
      feedback,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create feedback
export const createFeedback = async (req, res) => {
  const { userId, productId, quizId, rating, comment, category, title, totalQuestions } = req.body;

  if (!userId || !comment || !String(comment).trim()) {
    return res.status(400).json({
      message: "userId and comment are required",
    });
  }

  if (rating !== undefined && rating !== null && (rating < 1 || rating > 5)) {
    return res.status(400).json({
      message: "Rating must be between 1 and 5",
    });
  }

  try {
    let quizRecordId = quizId || null;

    if (!quizRecordId && category) {
      const [quizData] = await sequelize.query(
        "SELECT id FROM quizzes WHERE category = :category ORDER BY \"createdAt\" DESC LIMIT 1",
        { replacements: { category } }
      );

      if (quizData.length > 0) {
        quizRecordId = quizData[0].id;
      } else if (totalQuestions) {
        const [createdQuiz] = await sequelize.query(
          `INSERT INTO quizzes (title, description, category, difficulty, "timeLimit", "totalQuestions", "passingScore", "isActive", "createdAt", "updatedAt")
           VALUES (:title, :description, :category, :difficulty, :timeLimit, :totalQuestions, :passingScore, true, NOW(), NOW())
           RETURNING id`,
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
        quizRecordId = createdQuiz[0]?.id || null;
      }
    }

    const [result] = await sequelize.query(
      `INSERT INTO feedbacks ("userId", "productId", "quizId", "quizCategory", "quizTitle", rating, comment, "createdAt", "updatedAt")
       VALUES (:userId, :productId, :quizId, :quizCategory, :quizTitle, :rating, :comment, NOW(), NOW())
       RETURNING *`,
      {
        replacements: {
          userId,
          productId: productId || null,
          quizId: quizRecordId,
          quizCategory: category || null,
          quizTitle: title || null,
          rating: rating ?? null,
          comment: String(comment).trim(),
        },
      }
    );

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: result[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update feedback
export const updateFeedback = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const [feedback] = await sequelize.query(
      "SELECT * FROM feedbacks WHERE id = :id",
      { replacements: { id } }
    );

    if (feedback.length === 0) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    const [result] = await sequelize.query(
      `UPDATE feedbacks 
       SET rating = :rating, comment = :comment, "updatedAt" = NOW()
       WHERE id = :id
       RETURNING *`,
      {
        replacements: {
          id,
          rating: rating !== undefined ? rating : feedback[0].rating,
          comment: comment !== undefined ? comment : feedback[0].comment,
        },
      }
    );

    res.json({
      message: "Feedback updated successfully",
      feedback: result[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete feedback
export const deleteFeedback = async (req, res) => {
  const { id } = req.params;

  try {
    const [feedback] = await sequelize.query(
      "SELECT id FROM feedbacks WHERE id = :id",
      { replacements: { id } }
    );

    if (feedback.length === 0) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    await sequelize.query(
      "DELETE FROM feedbacks WHERE id = :id",
      { replacements: { id } }
    );

    res.json({
      message: "Feedback deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get average rating for product
export const getProductAverageRating = async (req, res) => {
  const { productId } = req.params;

  try {
    const [result] = await sequelize.query(
      `SELECT AVG(rating) as averageRating, COUNT(id) as totalReviews
       FROM feedbacks
       WHERE "productId" = :productId AND rating IS NOT NULL`,
      { replacements: { productId } }
    );

    res.json({
      message: "Product rating retrieved successfully",
      data: result[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
