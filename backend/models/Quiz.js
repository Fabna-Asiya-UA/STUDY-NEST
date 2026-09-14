import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (options) {
          return options.length >= 2;
        },
        message:
          "A question must have at least 2 options"
      }
    },

    answer: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    _id: true
  }
);

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    subject: {
      type: String,
      required: true,
      trim: true
    },

    questions: {
      type: [questionSchema],
      required: true,
      validate: {
        validator: function (questions) {
          return questions.length > 0;
        },
        message:
          "Quiz must contain at least one question"
      }
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Quiz = mongoose.model(
  "Quiz",
  quizSchema
);

export default Quiz;