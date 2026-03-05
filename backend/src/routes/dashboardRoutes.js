// src/routes/dashboardRoutes.js
import express from 'express';          // <-- ES Module import
import { getDashboard } from '../controllers/dashboardController.js'; // <-- note .js

const router = express.Router();

router.get('/:userId', getDashboard);

export default router;                 // <-- default export