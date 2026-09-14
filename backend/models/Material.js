import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true,
      default: ""
    },

    fileUrl: {
      type: String,
      default: ""
    },

    videoUrl: {
      type: String,
      default: ""
    },

    subject: {
      type: String,
      trim: true,
      default: ""
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

export default mongoose.model(
  "Material",
  materialSchema
);