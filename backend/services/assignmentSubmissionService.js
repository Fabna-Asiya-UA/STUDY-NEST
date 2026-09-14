import AssignmentSubmission from "../models/AssignmentSubmission.js";
import Assignment from "../models/Assignment.js";
import Connection from "../models/Connection.js";


// ========================================
// STUDENT SUBMIT ASSIGNMENT
// ========================================

export const submitAssignment = async ({
  assignmentId,
  studentId,
  answer,
  fileUrl
}) => {

  const connection =
    await Connection.findOne({
      student: studentId,
      status: "accepted"
    });

  if (!connection) {
    throw new Error(
      "You are not connected with a teacher"
    );
  }


  const assignment =
    await Assignment.findOne({
      _id: assignmentId,
      teacher: connection.teacher
    });

  if (!assignment) {
    throw new Error(
      "Assignment not found"
    );
  }


  const existingSubmission =
    await AssignmentSubmission.findOne({
      assignment: assignmentId,
      student: studentId
    });

  if (existingSubmission) {
    throw new Error(
      "You have already submitted this assignment"
    );
  }


  if (
    (!answer || !answer.trim()) &&
    !fileUrl
  ) {
    throw new Error(
      "Please provide an answer or upload a file"
    );
  }


  const submission =
    await AssignmentSubmission.create({
      assignment: assignment._id,
      student: studentId,
      teacher: connection.teacher,
      answer: answer?.trim() || "",
      fileUrl: fileUrl || "",
      status: "submitted",
      submittedAt: new Date()
    });


  return submission;
};


// ========================================
// GET STUDENT SUBMISSIONS
// ========================================

export const getStudentSubmissions = async (
  studentId
) => {

  const submissions =
    await AssignmentSubmission.find({
      student: studentId
    })
      .populate(
        "assignment",
        "title description subject dueDate"
      )
      .populate(
        "teacher",
        "name email"
      )
      .sort({
        createdAt: -1
      });


  return submissions;
};


// ========================================
// GET SUBMISSION FOR ONE ASSIGNMENT
// ========================================

export const getStudentAssignmentSubmission =
  async (
    assignmentId,
    studentId
  ) => {

    const submission =
      await AssignmentSubmission.findOne({
        assignment: assignmentId,
        student: studentId
      })
        .populate(
          "assignment",
          "title description subject dueDate"
        )
        .populate(
          "teacher",
          "name email"
        );


    return submission;
  };


// ========================================
// TEACHER GET ALL SUBMISSIONS
// ========================================

export const getTeacherSubmissions = async (
  teacherId
) => {

  const submissions =
    await AssignmentSubmission.find({
      teacher: teacherId
    })
      .populate(
        "assignment",
        "title description subject dueDate"
      )
      .populate(
        "student",
        "name email profileImage"
      )
      .sort({
        createdAt: -1
      });


  return submissions;
};


// ========================================
// TEACHER GET SUBMISSIONS FOR ASSIGNMENT
// ========================================

export const getAssignmentSubmissions =
  async (
    assignmentId,
    teacherId
  ) => {

    const assignment =
      await Assignment.findOne({
        _id: assignmentId,
        teacher: teacherId
      });

    if (!assignment) {
      throw new Error(
        "Assignment not found or you are not authorized"
      );
    }


    const submissions =
      await AssignmentSubmission.find({
        assignment: assignmentId,
        teacher: teacherId
      })
        .populate(
          "student",
          "name email profileImage"
        )
        .populate(
          "assignment",
          "title description subject dueDate"
        )
        .sort({
          createdAt: -1
        });


    return submissions;
  };


// ========================================
// TEACHER GRADE SUBMISSION
// ========================================

export const gradeAssignmentSubmission =
  async (
    submissionId,
    teacherId,
    marks,
    feedback
  ) => {

    const submission =
      await AssignmentSubmission.findOne({
        _id: submissionId,
        teacher: teacherId
      });

    if (!submission) {
      throw new Error(
        "Submission not found or you are not authorized"
      );
    }


    if (
      marks === undefined ||
      marks === null ||
      marks === ""
    ) {
      throw new Error(
        "Marks are required"
      );
    }


    const numericMarks =
      Number(marks);


    if (
      Number.isNaN(numericMarks) ||
      numericMarks < 0
    ) {
      throw new Error(
        "Marks must be a valid positive number"
      );
    }


    submission.marks =
      numericMarks;

    submission.feedback =
      feedback?.trim() || "";

    submission.status =
      "graded";

    submission.gradedAt =
      new Date();


    await submission.save();


    return submission;
  };