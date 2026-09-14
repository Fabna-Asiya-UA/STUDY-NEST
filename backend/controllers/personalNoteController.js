import PersonalNote from "../models/PersonalNote.js";


// Get personal notes
export const getPersonalNotes = async (req, res) => {
  try {
    const notes = await PersonalNote.find({
      student: req.user._id
    }).sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      notes
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Create personal note
export const createPersonalNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required"
      });
    }

    const note = await PersonalNote.create({
      student: req.user._id,
      title,
      content
    });

    res.status(201).json({
      success: true,
      note
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// DELETE personal note
export const deletePersonalNote = async (req, res) => {
  try {

    const { id } = req.params;

    const note = await PersonalNote.findOne({
      _id: id,
      student: req.user._id
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    await PersonalNote.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Personal note deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};