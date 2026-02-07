import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const QuizQuestion = sequelize.define(
  "QuizQuestion",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quizId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "quizzes",
        key: "id",
      },
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    options: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    correctIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "quiz_questions",
  }
);
