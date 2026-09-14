
import mongoose from "mongoose";


const studentSchema = new mongoose.Schema(
  {

    // Student name
    name: {
      type: String,
      required: true,
      trim: true
    },

    // Student email
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

    // Student role
    role: {
      type: String,
      default: "student",
      enum: ["student"]
    },

    // Connected teacher
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
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



const Student = mongoose.model(
  "Student",
  studentSchema
);

export default Student;

