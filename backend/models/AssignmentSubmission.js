import mongoose from "mongoose";

const assignmentSubmissionSchema =
  new mongoose.Schema(
    {
      assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
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

      answer: {
        type: String,
        trim: true,
        default: ""
      },

      fileUrl: {
        type: String,
        default: ""
      },

      status: {
        type: String,
        enum: [
          "submitted",
          "graded"
        ],
        default: "submitted"
      },

      marks: {
        type: Number,
        min: 0,
        default: null
      },

      feedback: {
        type: String,
        trim: true,
        default: ""
      },

      submittedAt: {
        type: Date,
        default: Date.now
      },

      gradedAt: {
        type: Date,
        default: null
      }
    },
    {
      timestamps: true
    }
  );

assignmentSubmissionSchema.index(
  {
    assignment: 1,
    student: 1
  },
  {
    unique: true
  }
);

const AssignmentSubmission =
  mongoose.model(
    "AssignmentSubmission",
    assignmentSubmissionSchema
  );

export default AssignmentSubmission;