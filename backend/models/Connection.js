
import mongoose from "mongoose";



const connectionSchema = new mongoose.Schema(

  {

    // Student who wants to connect
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },


    // Teacher the student wants to connect with
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },


    // Connection status
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected"
      ],
      default: "pending"
    }

  },

  {
    timestamps: true
  }

);



connectionSchema.index(
  {
    student: 1,
    teacher: 1
  },
  {
    unique: true
  }
);


const Connection = mongoose.model(
  "Connection",
  connectionSchema
);

export default Connection;

