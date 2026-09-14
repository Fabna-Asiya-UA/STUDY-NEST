import express from "express";

import {
  createAssignment,
  getAssignments,
  deleteAssignment
} from "../controllers/assignmentController.js";

import { protect } from "../middleware/auth.js";

import {
  teacherOnly
} from "../middleware/role.js";

const router = express.Router();


// CREATE ASSIGNMENT
router.post(
  "/",
  protect,
  teacherOnly,
  createAssignment
);


// GET ASSIGNMENTS
router.get(
  "/",
  protect,
  getAssignments
);


// DELETE ASSIGNMENT
router.delete(
  "/:id",
  protect,
  teacherOnly,
  deleteAssignment
);


export default router;