import express from "express";

import {
  createMaterial,
  getMaterials,
  deleteMaterial
} from "../controllers/materialController.js";

import { protect } from "../middleware/auth.js";

import {
  teacherOnly
} from "../middleware/role.js";

const router = express.Router();


// Teacher uploads material
router.post(
  "/",
  protect,
  teacherOnly,
  createMaterial
);


// Teacher or student views materials
router.get(
  "/",
  protect,
  getMaterials
);


// Teacher deletes material
router.delete(
  "/:id",
  protect,
  teacherOnly,
  deleteMaterial
);

export default router;