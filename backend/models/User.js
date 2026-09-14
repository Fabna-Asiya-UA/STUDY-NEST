import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // User name
    name: {
      type: String,
      required: true,
      trim: true
    },

    // User email
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

    // User role
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student"
    },

    // Teacher connected to this student
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    // Teacher connection code
    connectionCode: {
      type: String,
      unique: true,
      sparse: true,
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

const User = mongoose.model("User", userSchema);

export default User;