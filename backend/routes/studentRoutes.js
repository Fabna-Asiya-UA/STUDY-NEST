import express from "express";

import {
  getStudentProfile,
  updateStudentProfile,
  getConnectedTeacher,
  getStudentDashboard
} from "../controllers/studentController.js";

import { protect } from "../middleware/auth.js";
import { studentOnly } from "../middleware/role.js";

const router = express.Router();


// ========================================
// STUDENT PROFILE
// ========================================

router.get(
  "/profile",
  protect,
  studentOnly,
  getStudentProfile
);


// ========================================
// UPDATE PROFILE
// ========================================

router.put(
  "/profile",
  protect,
  studentOnly,
  updateStudentProfile
);


// ========================================
// CONNECTED TEACHER
// ========================================

router.get(
  "/teacher",
  protect,
  studentOnly,
  getConnectedTeacher
);


// ========================================
// STUDENT DASHBOARD
// ========================================

router.get(
  "/dashboard",
  protect,
  studentOnly,
  getStudentDashboard
);


export default router;