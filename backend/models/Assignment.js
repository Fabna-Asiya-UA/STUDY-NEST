import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    subject: {
      type: String,
      trim: true,
      default: ""
    },

    dueDate: {
      type: Date,
      required: true
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

const Assignment = mongoose.model(
  "Assignment",
  assignmentSchema
);

export default Assignment;