import User from "../models/User.js";
import Material from "../models/Material.js";
import Assignment from "../models/Assignment.js";
import Quiz from "../models/Quiz.js";
import QuizResult from "../models/QuizResult.js";
import Connection from "../models/Connection.js";


// ========================================
// GET STUDENT PROFILE
// ========================================

export const getStudentProfile = async (
  req,
  res
) => {
  try {

    const student =
      await User.findById(req.user._id)
        .select("-password");


    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }


    // Get ALL accepted teachers
    const connections =
      await Connection.find({
        student: student._id,
        status: "accepted"
      }).populate(
        "teacher",
        "name email profileImage"
      );


    const teachers =
      connections
        .map(
          (connection) =>
            connection.teacher
        )
        .filter(Boolean);


    res.status(200).json({

      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        profileImage:
          student.profileImage
      },

      teachers

    });

  } catch (error) {

    console.error(
      "GET STUDENT PROFILE ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });

  }
};


// ========================================
// UPDATE STUDENT PROFILE
// ========================================

export const updateStudentProfile = async (
  req,
  res
) => {
  try {

    const {
      name,
      email
    } = req.body;


    const student =
      await User.findById(
        req.user._id
      );


    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }


    if (
      name &&
      name.trim()
    ) {
      student.name =
        name.trim();
    }


    if (
      email &&
      email.trim()
    ) {

      const normalizedEmail =
        email
          .trim()
          .toLowerCase();


      const existingUser =
        await User.findOne({
          email: normalizedEmail,
          _id: {
            $ne: req.user._id
          }
        });


      if (existingUser) {
        return res.status(400).json({
          message:
            "Email is already in use"
        });
      }


      student.email =
        normalizedEmail;
    }


    await student.save();


    res.status(200).json({

      message:
        "Profile updated successfully",

      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        profileImage:
          student.profileImage
      }

    });

  } catch (error) {

    console.error(
      "UPDATE STUDENT PROFILE ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });

  }
};


// ========================================
// GET CONNECTED TEACHERS
// ========================================

export const getConnectedTeacher = async (
  req,
  res
) => {
  try {

    // Get ALL accepted teachers
    const connections =
      await Connection.find({
        student: req.user._id,
        status: "accepted"
      })
        .populate(
          "teacher",
          "name email profileImage"
        )
        .sort({
          createdAt: -1
        });


    const teachers =
      connections
        .map(
          (connection) =>
            connection.teacher
        )
        .filter(Boolean);


    if (!teachers.length) {
      return res.status(404).json({
        message:
          "You are not connected to any teacher"
      });
    }


    res.status(200).json({
      teachers
    });

  } catch (error) {

    console.error(
      "GET CONNECTED TEACHERS ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });

  }
};


// ========================================
// STUDENT DASHBOARD
// ========================================

export const getStudentDashboard = async (
  req,
  res
) => {
  try {

    // ========================================
    // GET STUDENT
    // ========================================

    const student =
      await User.findById(
        req.user._id
      );


    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }


    // ========================================
    // GET ALL ACCEPTED CONNECTIONS
    // ========================================

    const connections =
      await Connection.find({
        student: student._id,
        status: "accepted"
      })
        .populate(
          "teacher",
          "name email profileImage"
        )
        .sort({
          createdAt: -1
        });


    // ========================================
    // GET ALL CONNECTED TEACHERS
    // ========================================

    const teachers =
      connections
        .map(
          (connection) =>
            connection.teacher
        )
        .filter(Boolean);


    // ========================================
    // STUDENT NOT CONNECTED
    // ========================================

    if (!teachers.length) {

      return res.status(200).json({

        message:
          "Connect with a teacher to access learning resources",

        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          role: student.role,
          profileImage:
            student.profileImage
        },

        teachers: [],

        counts: {
          materials: 0,
          assignments: 0,
          quizzes: 0,
          results: 0
        },

        materials: [],
        assignments: [],
        quizzes: [],
        results: []

      });

    }


    // ========================================
    // GET ALL TEACHER IDS
    // ========================================

    const teacherIds =
      teachers.map(
        (teacher) =>
          teacher._id
      );


    // ========================================
    // GET MATERIALS
    // ========================================

    const materials =
      await Material.find({
        teacher: {
          $in: teacherIds
        }
      })
        .populate(
          "teacher",
          "name email profileImage"
        )
        .select(
          "title description subject fileUrl videoUrl teacher createdAt"
        )
        .sort({
          createdAt: -1
        });


    // ========================================
    // GET ASSIGNMENTS
    // ========================================

    const assignments =
      await Assignment.find({
        teacher: {
          $in: teacherIds
        }
      })
        .populate(
          "teacher",
          "name email profileImage"
        )
        .select(
          "title description subject dueDate teacher createdAt"
        )
        .sort({
          dueDate: 1
        });


    // ========================================
    // GET QUIZZES
    // ========================================

    const quizzes =
      await Quiz.aggregate([

        {
          $match: {
            teacher: {
              $in: teacherIds
            }
          }
        },

        {
          $project: {

            title: 1,

            subject: 1,

            teacher: 1,

            createdAt: 1,

            questionCount: {
              $size: {
                $ifNull: [
                  "$questions",
                  []
                ]
              }
            }

          }
        },

        {
          $sort: {
            createdAt: -1
          }
        }

      ]);


    // ========================================
    // POPULATE QUIZ TEACHER
    // ========================================

    await Quiz.populate(
      quizzes,
      {
        path: "teacher",
        select:
          "name email profileImage"
      }
    );


    // ========================================
    // GET ALL STUDENT QUIZ RESULTS
    // ========================================

    const results =
      await QuizResult.find({
        student: student._id,
        teacher: {
          $in: teacherIds
        }
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


    // ========================================
    // RESPONSE
    // ========================================

    res.status(200).json({

      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        profileImage:
          student.profileImage
      },


      // ALL CONNECTED TEACHERS
      teachers,


      // COUNTS
      counts: {

        materials:
          materials.length,

        assignments:
          assignments.length,

        quizzes:
          quizzes.length,

        results:
          results.length

      },


      // RESOURCES
      materials,

      assignments,

      quizzes,

      results

    });

  } catch (error) {

    console.error(
      "STUDENT DASHBOARD ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });

  }
};