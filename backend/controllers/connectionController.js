
import {
  connectStudentToTeacher,
  getTeacherConnectionRequests,
  acceptConnectionRequest,
  rejectConnectionRequest
} from "../services/connectionService.js";


// ========================================
// STUDENT CONNECTS TO TEACHER
// ========================================

export const connectTeacher = async (
  req,
  res,
  next
) => {

  try {

    const { code } = req.body;


    // Check connection code
    if (!code) {

      return res.status(400).json({
        success: false,
        message: "Connection code is required"
      });

    }


    // Make sure code is exactly 6 digits
    if (!/^\d{6}$/.test(code)) {

      return res.status(400).json({
        success: false,
        message: "Connection code must be 6 digits"
      });

    }


    const result =
      await connectStudentToTeacher(
        req.user._id,
        code
      );


    res.status(201).json({

      success: true,

      message:
        "Connection request sent successfully",

      connection:
        result.connection,

      teacher:
        result.teacher

    });

  } catch (error) {

    next(error);

  }

};


// ========================================
// TEACHER GETS CONNECTION REQUESTS
// ========================================

export const getConnectionRequests = async (
  req,
  res,
  next
) => {

  try {

    const requests =
      await getTeacherConnectionRequests(
        req.user._id
      );


    res.status(200).json({

      success: true,

      requests

    });

  } catch (error) {

    next(error);

  }

};


// ========================================
// TEACHER ACCEPTS CONNECTION REQUEST
// ========================================

export const acceptConnection = async (
  req,
  res,
  next
) => {

  try {

    const { id } = req.params;


    const connection =
      await acceptConnectionRequest(
        id,
        req.user._id
      );


    res.status(200).json({

      success: true,

      message:
        "Connection request accepted",

      connection

    });

  } catch (error) {

    next(error);

  }

};


// ========================================
// TEACHER REJECTS CONNECTION REQUEST
// ========================================

export const rejectConnection = async (
  req,
  res,
  next
) => {

  try {

    const { id } = req.params;


    const connection =
      await rejectConnectionRequest(
        id,
        req.user._id
      );


    res.status(200).json({

      success: true,

      message:
        "Connection request rejected",

      connection

    });

  } catch (error) {

    next(error);

  }

};

