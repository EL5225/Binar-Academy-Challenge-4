export const errorHandler = (err, req, res, next) => {
  switch (err.code) {
    case "P2025":
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        error: `Operation Failed because of ${err.meta.cause}`,
      });

    default:
      return res.status(500).json({
        status: false,
        message: "Internal Server error",
        error: err.message,
      });
  }
};

export const notFound = (req, res, next) => {
  res.status(404).json({
    status: false,
    message: "Not Found",
  });
};
