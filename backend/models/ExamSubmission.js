import mongoose from "mongoose";

const examSubmissionSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    answerFileUrl: {
      type: String,
      required: true
    },

    submittedAt: {
      type: Date,
      default: Date.now
    },

    marks: {
      type: Number,
      default: null
    },

    feedback: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "ExamSubmission",
  examSubmissionSchema
);