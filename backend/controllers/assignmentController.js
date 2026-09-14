import {
  createAssignment as createAssignmentService,
  getTeacherAssignments,
  getStudentAssignments,
  deleteAssignment as deleteAssignmentService
} from "../services/assignmentService.js";


// CREATE ASSIGNMENT
export const createAssignment = async (
  req,
  res,
  next
) => {
  try {
    const {
      title,
      description,
      subject,
      dueDate
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Assignment title is required"
      });
    }

    if (
      !description ||
      !description.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Assignment description is required"
      });
    }

    if (!dueDate) {
      return res.status(400).json({
        success: false,
        message: "Due date is required"
      });
    }

    const parsedDueDate =
      new Date(dueDate);

    if (isNaN(parsedDueDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid due date"
      });
    }

    const assignment =
      await createAssignmentService({
        title: title.trim(),
        description: description.trim(),
        subject: subject?.trim() || "",
        dueDate: parsedDueDate,
        teacherId: req.user._id
      });

    res.status(201).json({
      success: true,
      message:
        "Assignment created successfully",
      assignment
    });
  } catch (error) {
    next(error);
  }
};


// GET ASSIGNMENTS
export const getAssignments = async (
  req,
  res,
  next
) => {
  try {
    let assignments;

    if (req.user.role === "teacher") {
      assignments =
        await getTeacherAssignments(
          req.user._id
        );
    } else if (req.user.role === "student") {
      assignments =
        await getStudentAssignments(
          req.user._id
        );
    } else {
      return res.status(403).json({
        success: false,
        message:
          "Only teachers and students can access assignments"
      });
    }

    res.status(200).json({
      success: true,
      assignments
    });
  } catch (error) {
    next(error);
  }
};


// DELETE ASSIGNMENT
export const deleteAssignment = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    await deleteAssignmentService(
      id,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message:
        "Assignment deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};