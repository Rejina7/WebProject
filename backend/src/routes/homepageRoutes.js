import express from "express";
import { getHomepage} from "../controllers/homepageController.js";

const router = express.Router();

router.get("/:userId", getHomepage);

export default router;
