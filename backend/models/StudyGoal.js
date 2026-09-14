import mongoose from "mongoose";

const studyGoalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    targetDate: {
      type: Date
    },

    completed: {
      type: Boolean,
      default: false
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "StudyGoal",
  studyGoalSchema
);