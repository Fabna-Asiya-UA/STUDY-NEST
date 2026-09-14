export const teacherOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  if (req.user.role !== "teacher") {
    return res.status(403).json({
      success: false,
      message: "Teacher access required"
    });
  }

  next();
};


export const studentOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  if (req.user.role !== "student") {
    return res.status(403).json({
      success: false,
      message: "Student access required"
    });
  }

  next();
};