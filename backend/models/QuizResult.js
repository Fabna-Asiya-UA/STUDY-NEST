
import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },

        selectedAnswer: {
          type: String,
          default: ""
        },

        isCorrect: {
          type: Boolean,
          default: false
        }
      }
    ],

    score: {
      type: Number,
      required: true,
      min: 0
    },

    totalQuestions: {
      type: Number,
      required: true,
      min: 1
    },

    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  },
  {
    timestamps: true
  }
);

quizResultSchema.index({
  quiz: 1,
  student: 1
});

const QuizResult = mongoose.model(
  "QuizResult",
  quizResultSchema
);

export default QuizResult;

