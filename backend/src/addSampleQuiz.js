import { sequelize } from "./db.js";
import { Quiz } from "./models/Quiz.js";
import { QuizQuestion } from "./models/QuizQuestion.js";

async function addSampleQuiz() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // Create quiz
    const [result] = await sequelize.query(
      `INSERT INTO quizzes (title, description, category, difficulty, "timeLimit", "totalQuestions", "passingScore", "isActive", "createdAt", "updatedAt")
       VALUES ('Laugh Challenge', 'A quiz to make you laugh!', 'laugh', 'easy', 300, 3, 60, true, NOW(), NOW())
       RETURNING id`);
    const quizId = result[0].id;
    console.log("✅ Quiz created with ID:", quizId);

    // Add questions
    await QuizQuestion.bulkCreate([
      {
        quizId,
        question: "What do you call a fake noodle?",
        options: ["Impasta", "Faux pasta", "Pretend spaghetti", "Mock linguine"],
        correctIndex: 0,
      },
      {
        quizId,
        question: "Why did the scarecrow win an award?",
        options: ["He was outstanding in his field", "He scared the most crows", "He looked scary", "He was made of gold"],
        correctIndex: 0,
      },
      {
        quizId,
        question: "Why don’t scientists trust atoms?",
        options: ["Because they make up everything", "Because they are small", "Because they explode", "Because they are invisible"],
        correctIndex: 0,
      },
    ]);
    console.log("✅ Questions added to quiz");

    await sequelize.close();
    console.log("✅ Script completed!");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

addSampleQuiz();
