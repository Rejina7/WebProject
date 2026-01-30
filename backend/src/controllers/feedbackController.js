import { sequelize } from "../db.js";

// Get all feedback
export const getAllFeedback = async (req, res) => {
  try {
    const [feedback] = await sequelize.query(
      `SELECT f.*, u.username, u.email, p.name as productName
       FROM feedbacks f
       JOIN users u ON f."userId" = u.id
       LEFT JOIN products p ON f."productId" = p.id
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
      `SELECT f.*, u.username, u.email
       FROM feedbacks f
       JOIN users u ON f."userId" = u.id
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
      `SELECT f.*, p.name as productName
       FROM feedbacks f
       LEFT JOIN products p ON f."productId" = p.id
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
  const { userId, productId, rating, comment } = req.body;

  if (!userId || !rating) {
    return res.status(400).json({
      message: "userId and rating are required",
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      message: "Rating must be between 1 and 5",
    });
  }

  try {
    const [result] = await sequelize.query(
      `INSERT INTO feedbacks ("userId", "productId", rating, comment)
       VALUES (:userId, :productId, :rating, :comment)
       RETURNING *`,
      {
        replacements: {
          userId,
          productId: productId || null,
          rating,
          comment: comment || null,
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
       WHERE "productId" = :productId`,
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
