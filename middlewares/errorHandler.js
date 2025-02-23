const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error:", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle Validation Errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(", ");
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  res.status(statusCode).json({ error: message });
};

export default errorHandler;
