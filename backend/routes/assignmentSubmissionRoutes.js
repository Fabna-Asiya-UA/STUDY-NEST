import express from "express";

import {
  submitAssignment,
  getMySubmissions,
  getMyAssignmentSubmission,
  getTeacherSubmissionList,
  getSubmissionsForAssignment,
  gradeSubmission
} from "../controllers/assignmentSubmissionController.js";

import {
  protect
} from "../middleware/auth.js";

import {
  studentOnly,
  teacherOnly
} from "../middleware/role.js";

const router = express.Router();


// ========================================
// STUDENT ROUTES
// ========================================

router.post(
  "/",
  protect,
  studentOnly,
  submitAssignment
);

router.get(
  "/student",
  protect,
  studentOnly,
  getMySubmissions
);

router.get(
  "/student/:assignmentId",
  protect,
  studentOnly,
  getMyAssignmentSubmission
);


// ========================================
// TEACHER ROUTES
// ========================================

router.get(
  "/teacher",
  protect,
  teacherOnly,
  getTeacherSubmissionList
);

router.get(
  "/teacher/assignment/:assignmentId",
  protect,
  teacherOnly,
  getSubmissionsForAssignment
);

router.patch(
  "/:id/grade",
  protect,
  teacherOnly,
  gradeSubmission
);


export default router;