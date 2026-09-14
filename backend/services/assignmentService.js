import Assignment from "../models/Assignment.js";

import Connection from "../models/Connection.js";


// ========================================
// CREATE ASSIGNMENT
// ========================================

export const createAssignment = async ({
  title,
  description,
  subject,
  dueDate,
  teacherId
}) => {

  const assignment =
    await Assignment.create({
      title,
      description,
      subject,
      dueDate,
      teacher: teacherId
    });

  return assignment;
};


// ========================================
// GET TEACHER ASSIGNMENTS
// ========================================

export const getTeacherAssignments = async (
  teacherId
) => {

  const assignments =
    await Assignment.find({
      teacher: teacherId
    })
      .populate(
        "teacher",
        "name email"
      )
      .sort({
        dueDate: 1
      });

  return assignments;
};


// ========================================
// GET STUDENT ASSIGNMENTS
// ========================================

export const getStudentAssignments = async (
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


  // Get assignments from ALL connected teachers
  const assignments =
    await Assignment.find({
      teacher: {
        $in: teacherIds
      }
    })
      .populate(
        "teacher",
        "name email"
      )
      .sort({
        dueDate: 1
      });


  return assignments;
};


// ========================================
// DELETE ASSIGNMENT
// ========================================

export const deleteAssignment = async (
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
      "Assignment not found or you are not authorized to delete it"
    );

  }


  await assignment.deleteOne();

  return assignment;
};