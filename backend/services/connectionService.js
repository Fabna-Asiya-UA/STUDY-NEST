import User from "../models/User.js";
import Connection from "../models/Connection.js";


// ========================================
// CONNECT STUDENT TO TEACHER
// ========================================

export const connectStudentToTeacher = async (
  studentId,
  connectionCode
) => {

  // Find teacher using connection code
  const teacher = await User.findOne({
    connectionCode,
    role: "teacher"
  });

  // Teacher not found
  if (!teacher) {
    throw new Error(
      "Invalid connection code"
    );
  }


  // Prevent student from connecting to himself
  if (
    teacher._id.toString() ===
    studentId.toString()
  ) {
    throw new Error(
      "You cannot connect to yourself"
    );
  }


  // Check existing connection
  const existingConnection =
    await Connection.findOne({
      student: studentId,
      teacher: teacher._id
    });


  if (existingConnection) {

    if (
      existingConnection.status ===
      "pending"
    ) {
      throw new Error(
        "Connection request is already pending"
      );
    }


    if (
      existingConnection.status ===
      "accepted"
    ) {
      throw new Error(
        "You are already connected with this teacher"
      );
    }


    if (
      existingConnection.status ===
      "rejected"
    ) {
      throw new Error(
        "Your previous connection request was rejected"
      );
    }
  }


  // Create new connection
  const connection =
    await Connection.create({
      student: studentId,
      teacher: teacher._id,
      status: "pending"
    });


  return {
    connection,

    teacher: {
      id: teacher._id,
      name: teacher.name,
      email: teacher.email
    }
  };
};


// ========================================
// GET TEACHER CONNECTION REQUESTS
// ========================================

export const getTeacherConnectionRequests = async (
  teacherId
) => {

  const requests =
    await Connection.find({
      teacher: teacherId,
      status: "pending"
    })
      .populate(
        "student",
        "name email profileImage"
      )
      .sort({
        createdAt: -1
      });


  return requests;
};


// ========================================
// ACCEPT CONNECTION REQUEST
// ========================================

export const acceptConnectionRequest = async (
  connectionId,
  teacherId
) => {

  // Find pending connection
  const connection =
    await Connection.findOne({
      _id: connectionId,
      teacher: teacherId,
      status: "pending"
    });


  // Connection not found
  if (!connection) {
    throw new Error(
      "Connection request not found"
    );
  }


  // Update connection status
  connection.status = "accepted";

  await connection.save();


  // Return updated connection
  return connection;
};


// ========================================
// REJECT CONNECTION REQUEST
// ========================================

export const rejectConnectionRequest = async (
  connectionId,
  teacherId
) => {

  // Find pending connection
  const connection =
    await Connection.findOne({
      _id: connectionId,
      teacher: teacherId,
      status: "pending"
    });


  // Connection not found
  if (!connection) {
    throw new Error(
      "Connection request not found"
    );
  }


  // Update connection status
  connection.status = "rejected";

  await connection.save();


  // Return updated connection
  return connection;
};