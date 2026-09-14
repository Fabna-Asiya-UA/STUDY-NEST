import Exam from "../models/Exam.js";
import ExamSubmission from "../models/ExamSubmission.js";


// ========================================
// CREATE EXAM
// ========================================

export const createExam = async (req, res, next) => {
  try {
    const {
      title,
      subject,
      description,
      duration,
      examDate
    } = req.body;


    // Validate title
    if (!title?.trim()) {
      return res.status(400).json({
        message: "Exam title is required"
      });
    }


    // Validate subject
    if (!subject?.trim()) {
      return res.status(400).json({
        message: "Subject is required"
      });
    }


    // Validate duration
    if (!duration) {
      return res.status(400).json({
        message: "Duration is required"
      });
    }


    // Validate exam date
    if (!examDate) {
      return res.status(400).json({
        message: "Exam date is required"
      });
    }


    // Validate question paper
    if (!req.file) {
      return res.status(400).json({
        message: "Question paper is required"
      });
    }


    // Create file URL
    const questionPaperUrl =
      `/uploads/exams/${req.file.filename}`;


    // Create exam
    const exam = await Exam.create({
      title: title.trim(),
      subject: subject.trim(),
      description: description?.trim() || "",
      duration: Number(duration),
      examDate,
      questionPaperUrl,
      teacher: req.user._id
    });


    res.status(201).json({
      message: "Exam created successfully",
      exam
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// GET TEACHER EXAMS
// ========================================

export const getTeacherExams = async (
  req,
  res,
  next
) => {
  try {

    const exams = await Exam.find({
      teacher: req.user._id
    }).sort({
      createdAt: -1
    });


    res.status(200).json({
      exams
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// GET STUDENT EXAMS
// ========================================

export const getStudentExams = async (
  req,
  res,
  next
) => {
  try {

    const exams = await Exam.find()
      .populate(
        "teacher",
        "name email"
      )
      .sort({
        examDate: 1
      });


    res.status(200).json({
      exams
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// GET SINGLE EXAM
// ========================================

export const getExamById = async (
  req,
  res,
  next
) => {
  try {

    const exam = await Exam.findById(
      req.params.id
    ).populate(
      "teacher",
      "name email"
    );


    if (!exam) {
      return res.status(404).json({
        message: "Exam not found"
      });
    }


    res.status(200).json({
      exam
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// DELETE EXAM
// ========================================

export const deleteExam = async (
  req,
  res,
  next
) => {
  try {

    const exam = await Exam.findOne({
      _id: req.params.id,
      teacher: req.user._id
    });


    if (!exam) {
      return res.status(404).json({
        message: "Exam not found"
      });
    }


    await Exam.findByIdAndDelete(
      req.params.id
    );


    await ExamSubmission.deleteMany({
      exam: req.params.id
    });


    res.status(200).json({
      message: "Exam deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// SUBMIT EXAM ANSWER
// ========================================

export const submitExam = async (
  req,
  res,
  next
) => {
  try {

    const exam = await Exam.findById(
      req.params.id
    );


    if (!exam) {
      return res.status(404).json({
        message: "Exam not found"
      });
    }


    // Validate answer file
    if (!req.file) {
      return res.status(400).json({
        message: "Answer file is required"
      });
    }


    // Prevent duplicate submission
    const existingSubmission =
      await ExamSubmission.findOne({
        exam: exam._id,
        student: req.user._id
      });


    if (existingSubmission) {
      return res.status(400).json({
        message:
          "You have already submitted this exam"
      });
    }


    // Create answer file URL
    const answerFileUrl =
      `/uploads/submissions/${req.file.filename}`;


    // Create submission
    const submission =
      await ExamSubmission.create({
        exam: exam._id,
        student: req.user._id,
        answerFileUrl
      });


    res.status(201).json({
      message:
        "Exam answer submitted successfully",
      submission
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// TEACHER VIEW SUBMISSIONS
// ========================================

export const getExamSubmissions = async (
  req,
  res,
  next
) => {
  try {

    const exam = await Exam.findOne({
      _id: req.params.id,
      teacher: req.user._id
    });


    if (!exam) {
      return res.status(404).json({
        message: "Exam not found"
      });
    }


    const submissions =
      await ExamSubmission.find({
        exam: exam._id
      })
        .populate(
          "student",
          "name email"
        )
        .sort({
          submittedAt: -1
        });


    res.status(200).json({
      submissions
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// GRADE EXAM
// ========================================

export const gradeExam = async (
  req,
  res,
  next
) => {
  try {

    const {
      marks,
      feedback
    } = req.body;


    const submission =
      await ExamSubmission.findById(
        req.params.submissionId
      ).populate("exam");


    if (!submission) {
      return res.status(404).json({
        message: "Submission not found"
      });
    }


    if (
      submission.exam.teacher.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not allowed to grade this submission"
      });
    }


    submission.marks = Number(marks);

    submission.feedback =
      feedback || "";


    await submission.save();


    res.status(200).json({
      message: "Exam graded successfully",
      submission
    });

  } catch (error) {
    next(error);
  }
};