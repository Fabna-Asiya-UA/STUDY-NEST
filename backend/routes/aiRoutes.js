import express from "express";

import { askAI } from "../controllers/aiController.js";

import { protect } from "../middleware/auth.js";
import { studentOnly } from "../middleware/role.js";

const router = express.Router();

router.post(
  "/ask",
  protect,
  studentOnly,
  askAI
);

export default router;