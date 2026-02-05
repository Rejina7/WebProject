import { sequelize } from "./db.js";
import "./models/Quiz.js";

const seedQuizzes = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync({ alter: true });
    console.log("✅ Database models synced");

    const quizzes = [
      {
        title: "Science Fundamentals",
        description: "Test your knowledge of basic scientific principles",
        category: "Science",
        difficulty: "medium",
        timeLimit: 300,
        totalQuestions: 10,
        passingScore: 60,
        isActive: true,
      },
      {
        title: "IT Basics",
        description: "Computer science and information technology quiz",
        category: "IT",
        difficulty: "medium",
        timeLimit: 400,
        totalQuestions: 15,
        passingScore: 70,
        isActive: true,
      },
      {
        title: "World Geography",
        description: "Explore countries, capitals, and landmarks",
        category: "Geography",
        difficulty: "easy",
        timeLimit: 300,
        totalQuestions: 12,
        passingScore: 60,
        isActive: true,
      },
      {
        title: "General Knowledge Challenge",
        description: "Test your knowledge on various topics",
        category: "General Knowledge",
        difficulty: "medium",
        timeLimit: 500,
        totalQuestions: 20,
        passingScore: 65,
        isActive: true,
      },
      {
        title: "Entertainment Trivia",
        description: "Movies, music, and pop culture quiz",
        category: "Entertainment",
        difficulty: "easy",
        timeLimit: 300,
        totalQuestions: 10,
        passingScore: 60,
        isActive: true,
      },
      {
        title: "Stranger Things Expert",
        description: "How well do you know the Upside Down?",
        category: "Stranger Things",
        difficulty: "hard",
        timeLimit: 400,
        totalQuestions: 15,
        passingScore: 80,
        isActive: true,
      },
      {
        title: "World History",
        description: "Journey through important historical events",
        category: "History",
        difficulty: "medium",
        timeLimit: 450,
        totalQuestions: 18,
        passingScore: 70,
        isActive: true,
      },
      {
        title: "Mathematics Challenge",
        description: "Test your math skills and problem-solving",
        category: "Math",
        difficulty: "hard",
        timeLimit: 600,
        totalQuestions: 20,
        passingScore: 75,
        isActive: true,
      },
      {
        title: "Sports Trivia",
        description: "All about sports, athletes, and championships",
        category: "Sports",
        difficulty: "easy",
        timeLimit: 300,
        totalQuestions: 12,
        passingScore: 60,
        isActive: true,
      },
      {
        title: "Music Masters",
        description: "Test your knowledge of music genres and artists",
        category: "Music",
        difficulty: "medium",
        timeLimit: 350,
        totalQuestions: 15,
        passingScore: 65,
        isActive: true,
      },
      {
        title: "Space & Astronomy",
        description: "Explore the cosmos and celestial bodies",
        category: "Space",
        difficulty: "hard",
        timeLimit: 500,
        totalQuestions: 18,
        passingScore: 75,
        isActive: true,
      },
      {
        title: "Technology Trends",
        description: "Modern tech, gadgets, and innovations",
        category: "Technology",
        difficulty: "medium",
        timeLimit: 400,
        totalQuestions: 15,
        passingScore: 70,
        isActive: true,
      },
    ];

    console.log(`\n📝 Creating ${quizzes.length} quizzes...\n`);

    for (const quiz of quizzes) {
      const [result] = await sequelize.query(
        `INSERT INTO quizzes (title, description, category, difficulty, "timeLimit", "totalQuestions", "passingScore", "isActive", "createdAt", "updatedAt")
         VALUES (:title, :description, :category, :difficulty, :timeLimit, :totalQuestions, :passingScore, :isActive, NOW(), NOW())
         RETURNING id, title, category, difficulty`,
        {
          replacements: quiz,
        }
      );
      console.log(`✅ Created: ${result[0].title} (${result[0].category}) - ${result[0].difficulty}`);
    }

    // Display all quizzes
    const [allQuizzes] = await sequelize.query(
      "SELECT id, title, category, difficulty, \"totalQuestions\", \"isActive\" FROM quizzes ORDER BY id DESC"
    );
    console.log("\n📋 ALL QUIZZES IN DATABASE:");
    console.table(allQuizzes);

    await sequelize.close();
    console.log("\n✅ Script completed! Added", quizzes.length, "quizzes.");
  } catch (err) {
    console.error("❌ Error:", err.message);
    console.error(err);
    process.exit(1);
  }
};

seedQuizzes();
