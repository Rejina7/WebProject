import express from "express";
import {
  getAllFeedback,
  getFeedbackByProduct,
  getFeedbackByUser,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getProductAverageRating,
} from "../controllers/feedbackController.js";

const router = express.Router();

router.get("/", getAllFeedback);
router.get("/product/:productId", getFeedbackByProduct);
router.get("/product/:productId/rating", getProductAverageRating);
router.get("/user/:userId", getFeedbackByUser);
router.post("/", createFeedback);
router.put("/:id", updateFeedback);
router.delete("/:id", deleteFeedback);

export default router;
