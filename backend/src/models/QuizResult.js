import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const QuizResult = sequelize.define("QuizResult", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  quizId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "quizzes",
      key: "id",
    },
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalQuestions: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  correctAnswers: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timeTaken: {
    type: DataTypes.INTEGER, // in seconds
  },
  isPassed: {
    type: DataTypes.BOOLEAN,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "quiz_results",
  timestamps: false,
});
