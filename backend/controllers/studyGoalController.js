import StudyGoal from "../models/StudyGoal.js";


// ========================================
// CREATE STUDY GOAL
// ========================================

export const createGoal = async (req, res) => {
  try {

    const {
      title,
      description,
      targetDate
    } = req.body;


    // Validation

    if (!title || !targetDate) {
      return res.status(400).json({
        message: "Title and target date are required"
      });
    }


    // Create goal

    const goal = await StudyGoal.create({

      title,

      description,

      targetDate,

      student: req.user._id

    });


    res.status(201).json({

      message: "Study goal created successfully",

      goal

    });


  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }
};



// ========================================
// GET ALL STUDY GOALS
// ========================================

export const getGoals = async (req, res) => {
  try {

    const goals = await StudyGoal.find({

      student: req.user._id

    }).sort({

      createdAt: -1

    });


    res.status(200).json({

      goals

    });


  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }
};



// ========================================
// GET SINGLE STUDY GOAL
// ========================================

export const getGoalById = async (req, res) => {
  try {

    const goal = await StudyGoal.findOne({

      _id: req.params.id,

      student: req.user._id

    });


    if (!goal) {

      return res.status(404).json({

        message: "Study goal not found"

      });

    }


    res.status(200).json({

      goal

    });


  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }
};



// ========================================
// UPDATE STUDY GOAL
// ========================================

export const updateGoal = async (req, res) => {
  try {

    const goal = await StudyGoal.findOne({

      _id: req.params.id,

      student: req.user._id

    });


    if (!goal) {

      return res.status(404).json({

        message: "Study goal not found"

      });

    }


    const {
      title,
      description,
      targetDate,
      completed
    } = req.body;


    // Update only provided fields

    if (title !== undefined) {

      goal.title = title;

    }

    if (description !== undefined) {

      goal.description = description;

    }

    if (targetDate !== undefined) {

      goal.targetDate = targetDate;

    }

    if (completed !== undefined) {

      goal.completed = completed;

    }


    await goal.save();


    res.status(200).json({

      message: "Study goal updated successfully",

      goal

    });


  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }
};



// ========================================
// MARK GOAL AS COMPLETED
// ========================================

export const completeGoal = async (req, res) => {
  try {

    const goal = await StudyGoal.findOne({

      _id: req.params.id,

      student: req.user._id

    });


    if (!goal) {

      return res.status(404).json({

        message: "Study goal not found"

      });

    }


    goal.completed = true;

    await goal.save();


    res.status(200).json({

      message: "Study goal completed successfully",

      goal

    });


  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }
};



// ========================================
// DELETE STUDY GOAL
// ========================================

export const deleteGoal = async (req, res) => {
  try {

    const goal = await StudyGoal.findOne({

      _id: req.params.id,

      student: req.user._id

    });


    if (!goal) {

      return res.status(404).json({

        message: "Study goal not found"

      });

    }


    await StudyGoal.findByIdAndDelete(
      req.params.id
    );


    res.status(200).json({

      message: "Study goal deleted successfully"

    });


  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }
};