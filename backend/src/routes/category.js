import express from "express";
import { sequelize } from "../db.js";

const router = express.Router();

// Sequelize models (define here or import if already defined)
import { DataTypes } from "sequelize";

// Category model
const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "categories",
  timestamps: false,
});

// Question model
const Question = sequelize.define("Question", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  option_a: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  option_b: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  option_c: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  option_d: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  correct_option: {
    type: DataTypes.STRING(1),
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "questions",
  timestamps: false,
});

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [["id", "ASC"]] });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

// Get all questions for a category by category_id
router.get("/:categoryId/questions", async (req, res) => {
  const { categoryId } = req.params;
  try {
    const questions = await Question.findAll({
      where: { category_id: categoryId },
      order: [["id", "ASC"]],
    });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch questions" });
  }
});

export default router;
