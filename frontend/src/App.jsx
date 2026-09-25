import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Profile
import Profile from "./pages/profile/Profile";

// ========================================
// STUDENT PAGES
// ========================================

import StudentDashboard from "./pages/student/StudentDashboard";
import Materials from "./pages/student/Materials";
import Assignments from "./pages/student/Assignments";
import StudentAssignmentDetail from "./pages/student/StudentAssignmentDetail";

import Quizzes from "./pages/student/Quizzes";
import TakeQuiz from "./pages/student/TakeQuiz";

import Exams from "./pages/student/Exams";
import TakeExam from "./pages/student/TakeExam";

import PersonalNotes from "./pages/student/PersonalNotes";
import StudyGoals from "./pages/student/StudyGoals";
import AIChat from "./pages/student/AIChat";
import Performance from "./pages/student/Performance";
import StudentConnectTeacher from "./pages/student/StudentConnectTeacher";

// ========================================
// TEACHER PAGES
// ========================================

import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import Students from "./pages/teacher/Students";
import TeacherMaterials from "./pages/teacher/Materials";
import UploadMaterial from "./pages/teacher/UploadMaterial";

import CreateAssignment from "./pages/teacher/CreateAssignment";
import AssignmentSubmissions from "./pages/teacher/AssignmentSubmissions";

import CreateQuiz from "./pages/teacher/CreateQuiz";
import CreateExam from "./pages/teacher/CreateExam";

import Results from "./pages/teacher/Results";
import StudentReports from "./pages/teacher/StudentReports";
import TeacherPerformance from "./pages/teacher/Performance";

import QuizResult from "./pages/teacher/QuizResult";


function App() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>

      <AuthProvider>

        <Navbar />

        {/* Mobile Menu Button */}
        {!sidebarOpen && (
          <button
            className="mobile-menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
        )}

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* ========================================
            SIDEBAR
        ======================================== */}

        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        {/* ========================================
            MAIN CONTENT
        ======================================== */}

        <main className="main-content">

          <Routes>

            {/* ========================================
                PUBLIC ROUTES
            ======================================== */}

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />


            {/* ========================================
                PROFILE
            ======================================== */}

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />


            {/* ========================================
                STUDENT ROUTES
            ======================================== */}

            {/* Student Dashboard */}

            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute role="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />


            {/* Student Materials */}

            <Route
              path="/student/materials"
              element={
                <ProtectedRoute role="student">
                  <Materials />
                </ProtectedRoute>
              }
            />


            {/* Student Assignments */}

            <Route
              path="/student/assignments"
              element={
                <ProtectedRoute role="student">
                  <Assignments />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/assignments/:assignmentId"
              element={
                <ProtectedRoute role="student">
                  <StudentAssignmentDetail />
                </ProtectedRoute>
              }
            />


            {/* Student Quizzes */}

            <Route
              path="/student/quizzes"
              element={
                <ProtectedRoute role="student">
                  <Quizzes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/quizzes/result"
              element={
                <ProtectedRoute role="student">
                  <QuizResult />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/quizzes/:id"
              element={
                <ProtectedRoute role="student">
                  <TakeQuiz />
                </ProtectedRoute>
              }
            />


            {/* Student Exams */}

            <Route
              path="/student/exams"
              element={
                <ProtectedRoute role="student">
                  <Exams />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/exams/:id"
              element={
                <ProtectedRoute role="student">
                  <TakeExam />
                </ProtectedRoute>
              }
            />


            {/* Student Connect Teacher */}

            <Route
              path="/student/connect-teacher"
              element={
                <ProtectedRoute role="student">
                  <StudentConnectTeacher />
                </ProtectedRoute>
              }
            />


            {/* Personal Notes */}

            <Route
              path="/student/notes"
              element={
                <ProtectedRoute role="student">
                  <PersonalNotes />
                </ProtectedRoute>
              }
            />


            {/* Study Goals */}

            <Route
              path="/student/goals"
              element={
                <ProtectedRoute role="student">
                  <StudyGoals />
                </ProtectedRoute>
              }
            />


            {/* AI Chat */}

            <Route
              path="/student/ai"
              element={
                <ProtectedRoute role="student">
                  <AIChat />
                </ProtectedRoute>
              }
            />


            {/* Student Performance */}

            <Route
              path="/student/performance"
              element={
                <ProtectedRoute role="student">
                  <Performance />
                </ProtectedRoute>
              }
            />


            {/* ========================================
                TEACHER ROUTES
            ======================================== */}

            {/* Teacher Dashboard */}

            <Route
              path="/teacher/dashboard"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />


            {/* Teacher Students */}

            <Route
              path="/teacher/students"
              element={
                <ProtectedRoute role="teacher">
                  <Students />
                </ProtectedRoute>
              }
            />


            {/* Teacher Materials */}

            <Route
              path="/teacher/materials"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherMaterials />
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher/materials/upload"
              element={
                <ProtectedRoute role="teacher">
                  <UploadMaterial />
                </ProtectedRoute>
              }
            />


            {/* Teacher Assignments */}

            <Route
              path="/teacher/assignments/create"
              element={
                <ProtectedRoute role="teacher">
                  <CreateAssignment />
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher/assignments/:assignmentId/submissions"
              element={
                <ProtectedRoute role="teacher">
                  <AssignmentSubmissions />
                </ProtectedRoute>
              }
            />


            {/* Teacher Quizzes */}

            <Route
              path="/teacher/quizzes/create"
              element={
                <ProtectedRoute role="teacher">
                  <CreateQuiz />
                </ProtectedRoute>
              }
            />


            {/* Teacher Exams */}

            <Route
              path="/teacher/exams/create"
              element={
                <ProtectedRoute role="teacher">
                  <CreateExam />
                </ProtectedRoute>
              }
            />


            {/* Teacher Results */}

            <Route
              path="/teacher/results"
              element={
                <ProtectedRoute role="teacher">
                  <Results />
                </ProtectedRoute>
              }
            />


            {/* Student Reports */}

            <Route
              path="/teacher/reports"
              element={
                <ProtectedRoute role="teacher">
                  <StudentReports />
                </ProtectedRoute>
              }
            />


            {/* Teacher Performance */}

            <Route
              path="/teacher/performance"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherPerformance />
                </ProtectedRoute>
              }
            />

          </Routes>

        </main>

      </AuthProvider>

    </BrowserRouter>
  );
}

export default App;