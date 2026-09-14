import {
  submitAssignment as submitAssignmentService,
  getStudentSubmissions,
  getStudentAssignmentSubmission,
  getTeacherSubmissions,
  getAssignmentSubmissions,
  gradeAssignmentSubmission
} from "../services/assignmentSubmissionService.js";


// ========================================
// STUDENT SUBMIT ASSIGNMENT
// ========================================

export const submitAssignment = async (
  req,
  res,
  next
) => {

  try {

    const {
      assignmentId,
      answer,
      fileUrl
    } = req.body;


    if (!assignmentId) {
      return res.status(400).json({
        success: false,
        message:
          "Assignment ID is required"
      });
    }


    const submission =
      await submitAssignmentService({
        assignmentId,
        studentId: req.user._id,
        answer,
        fileUrl
      });


    res.status(201).json({
      success: true,
      message:
        "Assignment submitted successfully",
      submission
    });

  } catch (error) {

    next(error);

  }
};


// ========================================
// GET STUDENT SUBMISSIONS
// ========================================

export const getMySubmissions = async (
  req,
  res,
  next
) => {

  try {

    const submissions =
      await getStudentSubmissions(
        req.user._id
      );


    res.status(200).json({
      success: true,
      submissions
    });

  } catch (error) {

    next(error);

  }
};


// ========================================
// GET ONE STUDENT SUBMISSION
// ========================================

export const getMyAssignmentSubmission =
  async (
    req,
    res,
    next
  ) => {

    try {

      const {
        assignmentId
      } = req.params;


      const submission =
        await getStudentAssignmentSubmission(
          assignmentId,
          req.user._id
        );


      res.status(200).json({
        success: true,
        submission
      });

    } catch (error) {

      next(error);

    }
  };


// ========================================
// TEACHER GET ALL SUBMISSIONS
// ========================================

export const getTeacherSubmissionList =
  async (
    req,
    res,
    next
  ) => {

    try {

      const submissions =
        await getTeacherSubmissions(
          req.user._id
        );


      res.status(200).json({
        success: true,
        submissions
      });

    } catch (error) {

      next(error);

    }
  };


// ========================================
// TEACHER GET ASSIGNMENT SUBMISSIONS
// ========================================

export const getSubmissionsForAssignment =
  async (
    req,
    res,
    next
  ) => {

    try {

      const {
        assignmentId
      } = req.params;


      const submissions =
        await getAssignmentSubmissions(
          assignmentId,
          req.user._id
        );


      res.status(200).json({
        success: true,
        submissions
      });

    } catch (error) {

      next(error);

    }
  };


// ========================================
// TEACHER GRADE SUBMISSION
// ========================================

export const gradeSubmission = async (
  req,
  res,
  next
) => {

  try {

    const {
      marks,
      feedback
    } = req.body;


    const {
      id
    } = req.params;


    const submission =
      await gradeAssignmentSubmission(
        id,
        req.user._id,
        marks,
        feedback
      );


    res.status(200).json({
      success: true,
      message:
        "Assignment graded successfully",
      submission
    });

  } catch (error) {

    next(error);

  }
};