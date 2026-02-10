import { sequelize } from "../db.js";

// Admin adds a new question
export const addQuestion = async (req, res) => {
  const { question, optionA, optionB, optionC, optionD, correctOption, categoryId } = req.body;
  try {
    await sequelize.query(
      `INSERT INTO questions
       (question, option_a, option_b, option_c, option_d, correct_option, category_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [question, optionA, optionB, optionC, optionD, correctOption, categoryId]
    );
    res.status(201).json({ message: "Question added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User fetches questions by category
export const getQuizByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const [results] = await sequelize.query("SELECT * FROM questions WHERE category_id=$1", { bind: [categoryId] });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch all categories
export const getCategories = async (req, res) => {
  try {
    const [categories] = await sequelize.query("SELECT * FROM categories");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update question
export const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { question, optionA, optionB, optionC, optionD, correctOption, categoryId } = req.body;

  try {
    await sequelize.query(
      `UPDATE questions
       SET question=$1, option_a=$2, option_b=$3, option_c=$4, option_d=$5, correct_option=$6, category_id=$7
       WHERE id=$8`,
      [question, optionA, optionB, optionC, optionD, correctOption, categoryId, id]
    );
    res.json({ message: "Question updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete question
export const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    await sequelize.query("DELETE FROM questions WHERE id=$1", { bind: [id] });
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Submit quiz and calculate score
export const submitQuiz = async (req, res) => {
  const { userId, categoryId, answers } = req.body;
  try {
    let score = 0;
    for (let ans of answers) {
      const [result] = await sequelize.query(
        "SELECT correct_option FROM questions WHERE id=$1",
        { bind: [ans.questionId] }
      );
      if (result[0].correct_option === ans.selectedOption) score++;
    }
    await sequelize.query(
      "INSERT INTO quiz_results (user_id, category_id, score) VALUES ($1, $2, $3)",
      [userId, categoryId, score]
    );
    res.json({ message: "Quiz submitted successfully", score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user quiz results
export const getUserResults = async (req, res) => {
  const { userId } = req.params;
  try {
    const [results] = await sequelize.query(
      "SELECT * FROM quiz_results WHERE user_id=$1",
      { bind: [userId] }
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

