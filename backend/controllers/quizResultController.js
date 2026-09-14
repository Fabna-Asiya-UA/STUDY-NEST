import {
  getTeacherQuizResults,
  getTeacherResultsForQuiz,
  getStudentQuizResults
} from "../services/quizResultService.js";


// ========================================
// GET ALL TEACHER RESULTS
// ========================================

export const getTeacherResults = async (
  req,
  res,
  next
) => {
  try {

    const results =
      await getTeacherQuizResults(
        req.user._id
      );

    res.status(200).json({
      success: true,
      results
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// GET RESULTS FOR ONE QUIZ
// ========================================

export const getQuizResults = async (
  req,
  res,
  next
) => {
  try {

    const { quizId } =
      req.params;

    const results =
      await getTeacherResultsForQuiz(
        quizId,
        req.user._id
      );

    res.status(200).json({
      success: true,
      results
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// GET STUDENT RESULTS
// ========================================

export const getStudentResults = async (
  req,
  res,
  next
) => {
  try {

    const results =
      await getStudentQuizResults(
        req.user._id
      );

    res.status(200).json({
      success: true,
      results
    });

  } catch (error) {
    next(error);
  }
};