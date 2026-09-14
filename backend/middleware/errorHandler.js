// ========================================
// GLOBAL ERROR HANDLER
// ========================================

export const errorHandler = (err, req, res, next) => {

  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";


  // Mongoose invalid ID
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }


  // Mongoose validation error
  if (err.name === "ValidationError") {

    statusCode = 400;

    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
  }


  // MongoDB duplicate key
  if (err.code === 11000) {

    statusCode = 400;

    const field = Object.keys(err.keyValue || {})[0];

    message = field
      ? `${field} already exists`
      : "Duplicate value already exists";
  }


  // JWT invalid token
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }


  // JWT expired token
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired";
  }


  // Send response
  res.status(statusCode).json({
    success: false,
    message: message
  });

};