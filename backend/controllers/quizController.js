
import {
  createQuiz as createQuizService,
  getTeacherQuizzes,
  getStudentQuizzes,
  getQuizForStudent,
  deleteQuiz as deleteQuizService,
  submitQuiz as submitQuizService
} from "../services/quizService.js";
// CREATE QUIZ
export const createQuiz = async (
  req,
  res,
  next
) => {
  try {
    const {
      title,
      subject,
      questions
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Quiz title is required"
      });
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({
        success: false,
        message: "Subject is required"
      });
    }

    if (
      !questions ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "At least one question is required"
      });
    }

    for (const question of questions) {
      if (
        !question.question ||
        !question.question.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Every question must have question text"
        });
      }

      if (
        !Array.isArray(question.options) ||
        question.options.length < 2
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Every question must have at least 2 options"
        });
      }

      if (
        !question.answer ||
        !question.answer.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Every question must have a correct answer"
        });
      }

      if (
        !question.options.includes(
          question.answer
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Correct answer must match one of the options"
        });
      }
    }

    const quiz =
      await createQuizService({
        title: title.trim(),
        subject: subject.trim(),
        questions,
        teacherId: req.user._id
      });

    res.status(201).json({
      success: true,
      message:
        "Quiz created successfully",
      quiz
    });
  } catch (error) {
    next(error);
  }
};


// GET QUIZZES
export const getQuizzes = async (
  req,
  res,
  next
) => {
  try {
    let quizzes;

    if (req.user.role === "teacher") {
      quizzes =
        await getTeacherQuizzes(
          req.user._id
        );
    }

    else if (req.user.role === "student") {
      quizzes =
        await getStudentQuizzes(
          req.user._id
        );
    }

    else {
      return res.status(403).json({
        success: false,
        message:
          "Only teachers and students can access quizzes"
      });
    }

    res.status(200).json({
      success: true,
      quizzes
    });
  } catch (error) {
    next(error);
  }
};


// GET SINGLE QUIZ FOR STUDENT
export const getStudentQuiz = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const quiz =
      await getQuizForStudent(
        id,
        req.user._id
      );

    res.status(200).json({
      success: true,
      quiz
    });
  } catch (error) {
    next(error);
  }
};


// DELETE QUIZ
export const deleteQuiz = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    await deleteQuizService(
      id,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message:
        "Quiz deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};


export const submitQuiz = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    if (
      !answers ||
      !Array.isArray(answers)
    ) {
      return res.status(400).json({
        success: false,
        message: "Answers are required"
      });
    }

    const result =
      await submitQuizService(
        id,
        req.user._id,
        answers
      );

    res.status(200).json({
      success: true,
      message:
        "Quiz submitted successfully",

      result: {
        quizId: result.quiz._id,
        quizTitle: result.quiz.title,
        score: result.result.score,
        totalQuestions:
          result.result.totalQuestions,
        percentage:
          result.result.percentage,
        answers:
          result.result.answers
      }
    });
  } catch (error) {
    next(error);
  }
};