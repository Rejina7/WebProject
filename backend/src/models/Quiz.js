import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Quiz = sequelize.define("Quiz", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  difficulty: {
    type: DataTypes.ENUM("easy", "medium", "hard"),
    defaultValue: "medium",
  },
  timeLimit: {
    type: DataTypes.INTEGER, // in seconds
    defaultValue: 300,
  },
  totalQuestions: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  passingScore: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "quizzes",
});
