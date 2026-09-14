
import mongoose from "mongoose";


const teacherSchema = new mongoose.Schema(
  {

    // Teacher name
    name: {
      type: String,
      required: true,
      trim: true
    },

    // Teacher email
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    // Password
    password: {
      type: String,
      required: true,
      minlength: 6
    },

    // Teacher role
    role: {
      type: String,
      default: "teacher",
      enum: ["teacher"]
    },

    // Subject handled by teacher
    subject: {
      type: String,
      trim: true
    },

    // Profile image
    profileImage: {
      type: String,
      default: ""
    }

  },
  {
    timestamps: true
  }
);



const Teacher = mongoose.model(
  "Teacher",
  teacherSchema
);

export default Teacher;

