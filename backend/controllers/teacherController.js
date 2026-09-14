import User from "../models/User.js";
import Connection from "../models/Connection.js";
import Quiz from "../models/Quiz.js";
import Assignment from "../models/Assignment.js";
import Material from "../models/Material.js";
import generateCode from "../utils/generateCode.js";


// ========================================
// GENERATE CONNECTION CODE
// ========================================

export const generateConnectionCode = async (
  req,
  res
) => {
  try {
    const code = generateCode();

    req.user.connectionCode = code;

    await req.user.save();

    res.status(200).json({
      success: true,
      message:
        "Connection code generated",
      code
    });
  } catch (error) {
    console.error(
      "CONNECTION CODE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ========================================
// GET CONNECTED STUDENTS
// ========================================

export const getStudents = async (
  req,
  res
) => {
  try {
    const connections =
      await Connection.find({
        teacher: req.user._id,
        status: "accepted"
      })
        .populate(
          "student",
          "name email role profileImage createdAt"
        )
        .sort({
          createdAt: -1
        });

    const students =
      connections.map(
        (connection) =>
          connection.student
      );

    res.status(200).json({
      success: true,
      students
    });
  } catch (error) {
    console.error(
      "GET STUDENTS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ========================================
// GET TEACHER DASHBOARD
// ========================================

export const getTeacherDashboard = async (
  req,
  res
) => {
  try {

    // ========================================
    // GET ACCEPTED STUDENTS
    // ========================================

    const connections =
      await Connection.find({
        teacher: req.user._id,
        status: "accepted"
      })
        .populate(
          "student",
          "name email role profileImage createdAt"
        )
        .sort({
          createdAt: -1
        });

    const students =
      connections.map(
        (connection) =>
          connection.student
      );


    // ========================================
    // GET TEACHER INFORMATION
    // ========================================

    const teacher =
      await User.findById(
        req.user._id
      ).select(
        "name email role connectionCode"
      );


    // ========================================
    // GET TEACHER QUIZZES
    // ========================================

    const quizzes =
      await Quiz.find({
        teacher: req.user._id
      })
        .select(
          "title subject questions createdAt"
        )
        .sort({
          createdAt: -1
        });


    // ========================================
    // GET TEACHER ASSIGNMENTS
    // ========================================

    const assignments =
      await Assignment.find({
        teacher: req.user._id
      })
        .select(
          "title subject description dueDate createdAt"
        )
        .sort({
          createdAt: -1
        });


    // ========================================
    // GET TEACHER MATERIALS
    // ========================================

    const materials =
      await Material.find({
        teacher: req.user._id
      })
        .select(
          "title description subject fileUrl videoUrl createdAt"
        )
        .sort({
          createdAt: -1
        });


    // ========================================
    // SEND DASHBOARD DATA
    // ========================================

    res.status(200).json({

      success: true,

      teacher,

      // ========================================
      // STATISTICS
      // ========================================

      stats: {

        students:
          students.length,

        quizzes:
          quizzes.length,

        assignments:
          assignments.length,

        materials:
          materials.length

      },


      // ========================================
      // RECENT DATA
      // ========================================

      recentStudents:
        students.slice(0, 5),

      recentQuizzes:
        quizzes.slice(0, 5),

      recentAssignments:
        assignments.slice(0, 5),

      recentMaterials:
        materials.slice(0, 5)

    });

  } catch (error) {

    console.error(
      "TEACHER DASHBOARD ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load teacher dashboard"
    });

  }
};