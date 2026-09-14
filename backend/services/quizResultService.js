import QuizResult from "../models/QuizResult.js";


// ========================================
// GET TEACHER QUIZ RESULTS
// ========================================

export const getTeacherQuizResults = async (
  teacherId
) => {

  const results =
    await QuizResult.find({
      teacher: teacherId
    })
      .populate(
        "quiz",
        "title subject"
      )
      .populate(
        "student",
        "name email profileImage"
      )
      .sort({
        createdAt: -1
      });

  return results;
};


// ========================================
// GET RESULTS FOR ONE QUIZ
// ========================================

export const getTeacherResultsForQuiz = async (
  quizId,
  teacherId
) => {

  const results =
    await QuizResult.find({
      quiz: quizId,
      teacher: teacherId
    })
      .populate(
        "quiz",
        "title subject"
      )
      .populate(
        "student",
        "name email profileImage"
      )
      .sort({
        createdAt: -1
      });

  return results;
};


// ========================================
// GET STUDENT QUIZ RESULTS
// ========================================

export const getStudentQuizResults = async (
  studentId
) => {

  const results =
    await QuizResult.find({
      student: studentId
    })
      .populate(
        "quiz",
        "title subject"
      )
      .populate(
        "teacher",
        "name email profileImage"
      )
      .sort({
        createdAt: -1
      });

  return results;
};