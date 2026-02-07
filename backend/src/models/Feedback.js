import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Feedback = sequelize.define("Feedback", {
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
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: "products",
      key: "id",
    },
  },
  quizId: {
    type: DataTypes.INTEGER,
    references: {
      model: "quizzes",
      key: "id",
    },
  },
  quizCategory: {
    type: DataTypes.STRING,
  },
  quizTitle: {
    type: DataTypes.STRING,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comment: {
    type: DataTypes.TEXT,
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
  tableName: "feedbacks",
});
