import express from "express";

import {
  getTeacherResults,
  getQuizResults,
  getStudentResults
} from "../controllers/quizResultController.js";

import {
  protect
} from "../middleware/auth.js";

import {
  teacherOnly,
  studentOnly
} from "../middleware/role.js";

const router =
  express.Router();


// ========================================
// TEACHER RESULTS
// ========================================

router.get(
  "/teacher",
  protect,
  teacherOnly,
  getTeacherResults
);


router.get(
  "/quiz/:quizId",
  protect,
  teacherOnly,
  getQuizResults
);


// ========================================
// STUDENT RESULTS
// ========================================

router.get(
  "/student",
  protect,
  studentOnly,
  getStudentResults
);


export default router;