import Quiz from "../models/Quiz.js";
import Connection from "../models/Connection.js";
import QuizResult from "../models/QuizResult.js";


// ========================================
// CREATE QUIZ
// ========================================

export const createQuiz = async ({
  title,
  subject,
  questions,
  teacherId
}) => {

  const quiz = await Quiz.create({
    title,
    subject,
    questions,
    teacher: teacherId
  });

  return quiz;
};


// ========================================
// GET TEACHER QUIZZES
// ========================================

export const getTeacherQuizzes = async (
  teacherId
) => {

  const quizzes = await Quiz.find({
    teacher: teacherId
  })
    .populate(
      "teacher",
      "name email"
    )
    .sort({
      createdAt: -1
    });

  return quizzes;
};


// ========================================
// GET STUDENT QUIZZES
// ========================================

export const getStudentQuizzes = async (
  studentId
) => {

  // Find ALL accepted teacher connections
  const connections =
    await Connection.find({
      student: studentId,
      status: "accepted"
    });

  // No connected teachers
  if (!connections.length) {
    return [];
  }


  // Get all connected teacher IDs
  const teacherIds =
    connections.map(
      (connection) =>
        connection.teacher
    );


  // Get quizzes from ALL connected teachers
  const quizzes = await Quiz.find({
    teacher: {
      $in: teacherIds
    }
  })
    .select(
      "-questions.answer"
    )
    .populate(
      "teacher",
      "name email"
    )
    .sort({
      createdAt: -1
    });


  return quizzes;
};


// ========================================
// GET SINGLE QUIZ FOR STUDENT
// ========================================

export const getQuizForStudent = async (
  quizId,
  studentId
) => {

  // Find ALL accepted connections
  const connections =
    await Connection.find({
      student: studentId,
      status: "accepted"
    });

  // Student has no teachers
  if (!connections.length) {
    throw new Error(
      "You are not connected with any teacher"
    );
  }


  // Get all teacher IDs
  const teacherIds =
    connections.map(
      (connection) =>
        connection.teacher
    );


  // Find quiz belonging to any connected teacher
  const quiz = await Quiz.findOne({
    _id: quizId,
    teacher: {
      $in: teacherIds
    }
  }).select(
    "-questions.answer"
  );


  if (!quiz) {
    throw new Error(
      "Quiz not found or you are not connected with this teacher"
    );
  }


  return quiz;
};


// ========================================
// GET QUIZ WITH ANSWERS
// Used internally when calculating score
// ========================================

export const getQuizForEvaluation = async (
  quizId,
  studentId
) => {

  // Find ALL accepted connections
  const connections =
    await Connection.find({
      student: studentId,
      status: "accepted"
    });

  if (!connections.length) {
    throw new Error(
      "You are not connected with any teacher"
    );
  }


  // Get all connected teacher IDs
  const teacherIds =
    connections.map(
      (connection) =>
        connection.teacher
    );


  // Find quiz belonging to any connected teacher
  const quiz = await Quiz.findOne({
    _id: quizId,
    teacher: {
      $in: teacherIds
    }
  });


  if (!quiz) {
    throw new Error(
      "Quiz not found or you are not connected with this teacher"
    );
  }


  return quiz;
};


// ========================================
// SUBMIT QUIZ
// ========================================

export const submitQuiz = async (
  quizId,
  studentId,
  submittedAnswers
) => {

  // Find ALL accepted connections
  const connections =
    await Connection.find({
      student: studentId,
      status: "accepted"
    });


  if (!connections.length) {
    throw new Error(
      "You are not connected with any teacher"
    );
  }


  // Get all connected teacher IDs
  const teacherIds =
    connections.map(
      (connection) =>
        connection.teacher
    );


  // Find quiz belonging to any connected teacher
  const quiz = await Quiz.findOne({
    _id: quizId,
    teacher: {
      $in: teacherIds
    }
  });


  if (!quiz) {
    throw new Error(
      "Quiz not found or you are not connected with this teacher"
    );
  }


  // ========================================
  // CALCULATE SCORE
  // ========================================

  let score = 0;


  const answers =
    quiz.questions.map(
      (question) => {

        const submittedAnswer =
          submittedAnswers.find(
            (answer) =>
              String(
                answer.questionId
              ) ===
              String(
                question._id
              )
          );


        const selectedAnswer =
          submittedAnswer?.answer ||
          "";


        const isCorrect =
          selectedAnswer ===
          question.answer;


        if (isCorrect) {
          score++;
        }


        return {
          questionId:
            question._id,

          selectedAnswer,

          isCorrect
        };

      }
    );


  // ========================================
  // CALCULATE PERCENTAGE
  // ========================================

  const totalQuestions =
    quiz.questions.length;


  const percentage = Number(
    (
      (score / totalQuestions) *
      100
    ).toFixed(2)
  );


  // ========================================
  // SAVE RESULT
  // ========================================

  const quizResult =
    await QuizResult.create({

      quiz: quiz._id,

      student: studentId,

      teacher: quiz.teacher,

      answers,

      score,

      totalQuestions,

      percentage

    });


  return {
    quiz,
    result: quizResult
  };
};


// ========================================
// DELETE QUIZ
// ========================================

export const deleteQuiz = async (
  quizId,
  teacherId
) => {

  const quiz = await Quiz.findOne({
    _id: quizId,
    teacher: teacherId
  });


  if (!quiz) {

    throw new Error(
      "Quiz not found or you are not authorized to delete this quiz"
    );

  }


  await quiz.deleteOne();


  return quiz;
};