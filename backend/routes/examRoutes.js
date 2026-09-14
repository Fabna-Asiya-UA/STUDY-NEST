import express from "express";

import {
  createExam,
  getTeacherExams,
  getStudentExams,
  getExamById,
  deleteExam,
  submitExam,
  getExamSubmissions,
  gradeExam
} from "../controllers/examController.js";

import { protect } from "../middleware/auth.js";
import { teacherOnly, studentOnly } from "../middleware/role.js";

import upload from "../middleware/upload.js";

const router = express.Router();



router.post(
  "/",
  protect,
  teacherOnly,
  upload.single("questionPaper"),
  createExam
);



router.get(
  "/teacher",
  protect,
  teacherOnly,
  getTeacherExams
);



router.get(
  "/:id/submissions",
  protect,
  teacherOnly,
  getExamSubmissions
);



router.patch(
  "/submissions/:submissionId/grade",
  protect,
  teacherOnly,
  gradeExam
);



router.delete(
  "/:id",
  protect,
  teacherOnly,
  deleteExam
);


router.get(
  "/",
  protect,
  studentOnly,
  getStudentExams
);



router.get(
  "/:id",
  protect,
  studentOnly,
  getExamById
);



router.post(
  "/:id/submit",
  protect,
  studentOnly,
  upload.single("answerFile"),
  submitExam
);

export default router;