import express from "express";

import {
  getPersonalNotes,
  createPersonalNote,
  deletePersonalNote
} from "../controllers/personalNoteController.js";

import { protect } from "../middleware/auth.js";
import { studentOnly } from "../middleware/role.js";

const router = express.Router();


router.get(
  "/",
  protect,
  studentOnly,
  getPersonalNotes
);


router.post(
  "/",
  protect,
  studentOnly,
  createPersonalNote
);


// DELETE /api/notes/:id
router.delete(
  "/:id",
  protect,
  studentOnly,
  deletePersonalNote
);


export default router;