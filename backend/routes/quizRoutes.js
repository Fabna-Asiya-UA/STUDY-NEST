import express from "express";

import {
  createQuiz,
  getQuizzes,
  getStudentQuiz,
  submitQuiz,
  deleteQuiz
} from "../controllers/quizController.js";

import { protect } from "../middleware/auth.js";

import {
  teacherOnly,
  studentOnly
} from "../middleware/role.js";

const router = express.Router();


// CREATE QUIZ

router.post(
  "/",
  protect,
  teacherOnly,
  createQuiz
);


// GET TEACHER QUIZZES

router.get(
  "/teacher",
  protect,
  teacherOnly,
  getQuizzes
);


// GET STUDENT QUIZZES

router.get(
  "/",
  protect,
  studentOnly,
  getQuizzes
);


// GET SINGLE QUIZ FOR STUDENT

router.get(
  "/:id",
  protect,
  studentOnly,
  getStudentQuiz
);


// SUBMIT QUIZ

router.post(
  "/:id/submit",
  protect,
  studentOnly,
  submitQuiz
);


// DELETE QUIZ

router.delete(
  "/:id",
  protect,
  teacherOnly,
  deleteQuiz
);


export default router;