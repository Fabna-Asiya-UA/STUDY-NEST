import express from "express";

import {
  connectTeacher,
  getConnectionRequests,
  acceptConnection,
  rejectConnection
} from "../controllers/connectionController.js";

import {
  protect
} from "../middleware/auth.js";

import {
  studentOnly,
  teacherOnly
} from "../middleware/role.js";


const router = express.Router();


// ========================================
// STUDENT CONNECTS TO TEACHER
// ========================================

router.post(
  "/connect",
  protect,
  studentOnly,
  connectTeacher
);


// ========================================
// TEACHER GETS CONNECTION REQUESTS
// ========================================

router.get(
  "/requests",
  protect,
  teacherOnly,
  getConnectionRequests
);


// ========================================
// TEACHER ACCEPTS REQUEST
// ========================================

router.patch(
  "/:id/accept",
  protect,
  teacherOnly,
  acceptConnection
);



router.patch(
  "/:id/reject",
  protect,
  teacherOnly,
  rejectConnection
);


export default router;