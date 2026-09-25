const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", err.message);
  }

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Server error";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
  }

  if (err.code === "23505") {
    statusCode = 409;
    message = "Resource already exists";
  }

  if (err.code === "23503") {
    statusCode = 400;
    message = "Invalid reference";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { notFound, errorHandler };
