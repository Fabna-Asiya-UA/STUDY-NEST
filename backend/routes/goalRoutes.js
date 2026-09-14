
import express from "express";

import {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  completeGoal,
  deleteGoal
} from "../controllers/studyGoalController.js";

import { protect } from "../middleware/auth.js";
import { studentOnly } from "../middleware/role.js";


const router = express.Router();



router.post(
  "/",
  protect,
  studentOnly,
  createGoal
);



router.get(
  "/",
  protect,
  studentOnly,
  getGoals
);



router.get(
  "/:id",
  protect,
  studentOnly,
  getGoalById
);



router.put(
  "/:id",
  protect,
  studentOnly,
  updateGoal
);



router.patch(
  "/:id/complete",
  protect,
  studentOnly,
  completeGoal
);


router.delete(
  "/:id",
  protect,
  studentOnly,
  deleteGoal
);


export default router;

