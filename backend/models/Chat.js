
import mongoose from "mongoose";



const chatSchema = new mongoose.Schema(

  {

    // Student who sent the message
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },


    // Message sent by the student
    message: {
      type: String,
      required: true,
      trim: true
    },


    // AI response
    response: {
      type: String,
      required: true,
      trim: true
    }

  },

  {
    timestamps: true
  }

);



const Chat = mongoose.model(
  "Chat",
  chatSchema
);

export default Chat;

