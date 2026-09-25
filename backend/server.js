import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import quizResultRoutes from "./routes/quizResultRoutes.js";
import assignmentSubmissionRoutes from "./routes/assignmentSubmissionRoutes.js";
import examRoutes from "./routes/examRoutes.js";

import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";


const app = express();


// ========================================
// SECURITY
// ========================================

app.use(helmet());


// ========================================
// CORS
// ========================================

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);


// ========================================
// RATE LIMITING
// ========================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 100,

  message: {
    success: false,
    message: "Too many requests. Please try again later."
  },

  standardHeaders: true,
  legacyHeaders: false
});

app.use("/api", apiLimiter);


// ========================================
// BODY PARSER
// ========================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);


// ========================================
// COOKIE PARSER
// ========================================

app.use(cookieParser());


// ========================================
// LOGGER
// ========================================

app.use(morgan("combined"));


// ========================================
// STATIC UPLOADS
// ========================================

app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
);


// ========================================
// HOME / HEALTH CHECK
// ========================================

app.get("/", (req, res) => {

  res.status(200).json({
    success: true,
    message: "StudyNest API is running"
  });

});


// ========================================
// AUTH ROUTES
// ========================================

app.use(
  "/api/auth",
  authRoutes
);


// ========================================
// TEACHER ROUTES
// ========================================

app.use(
  "/api/teachers",
  teacherRoutes
);


// ========================================
// QUIZ RESULT ROUTES
// ========================================

app.use(
  "/api/quiz-results",
  quizResultRoutes
);


// ========================================
// EXAM ROUTES
// ========================================

app.use(
  "/api/exams",
  examRoutes
);


// ========================================
// STUDENT ROUTES
// ========================================

app.use(
  "/api/students",
  studentRoutes
);


// ========================================
// MATERIAL ROUTES
// ========================================

app.use(
  "/api/materials",
  materialRoutes
);


// ========================================
// ASSIGNMENT ROUTES
// ========================================

app.use(
  "/api/assignments",
  assignmentRoutes
);


// ========================================
// ASSIGNMENT SUBMISSION ROUTES
// ========================================

app.use(
  "/api/assignment-submissions",
  assignmentSubmissionRoutes
);


// ========================================
// QUIZ ROUTES
// ========================================

app.use(
  "/api/quizzes",
  quizRoutes
);


// ========================================
// CONNECTION ROUTES
// ========================================

app.use(
  "/api/connections",
  connectionRoutes
);


// ========================================
// PERSONAL NOTE ROUTES
// ========================================

app.use(
  "/api/notes",
  noteRoutes
);


// ========================================
// STUDY GOAL ROUTES
// ========================================

app.use(
  "/api/goals",
  goalRoutes
);


// ========================================
// AI ROUTES
// ========================================

app.use(
  "/api/ai",
  aiRoutes
);


// ========================================
// 404 - ROUTE NOT FOUND
// ========================================

app.use(notFound);


// ========================================
// GLOBAL ERROR HANDLER
// ========================================

app.use(errorHandler);


// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 3000;


const startServer = async () => {

  try {

    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {

      console.log(
        `StudyNest server running on http://localhost:${PORT}`
      );

    });

  } catch (error) {

    console.error(
      "Failed to start server:",
      error.message
    );

    process.exit(1);
  }

};


// ========================================
// RUN APPLICATION
// ========================================

startServer();