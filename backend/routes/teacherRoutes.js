import express from "express";

import {
  generateConnectionCode,
  getStudents,
  getTeacherDashboard
} from "../controllers/teacherController.js";

import { protect } from "../middleware/auth.js";

import {
  teacherOnly
} from "../middleware/role.js";


const router = express.Router();


router.post(
  "/connection-code",
  protect,
  teacherOnly,
  generateConnectionCode
);


router.get(
  "/students",
  protect,
  teacherOnly,
  getStudents
);


router.get(
  "/dashboard",
  protect,
  teacherOnly,
  getTeacherDashboard
);


export default router;