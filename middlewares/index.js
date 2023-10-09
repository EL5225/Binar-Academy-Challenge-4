import { Prisma } from "@prisma/client";

export const errorHandler = (err, req, res, next) => {
  return res.status(500).json({
    status: false,
    message: "Internal Server error",
    error: err.message,
  });
};

export const prismaErrorHandler = (err, req, res, next) => {
  const error = err.message.split("\n");

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({
      status: false,
      message: "Bad Request",
      error: error[error.length - 1],
    });
  }

  if (err instanceof Prisma.PrismaClientRustPanicError) {
    return res.status(400).json({
      status: false,
      message: "Bad Request",
      error: error[error.length - 1],
    });
  }

  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return res.status(400).json({
      status: false,
      message: "Bad Request",
      error: error[error.length - 1],
    });
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      status: false,
      message: "Bad Request",
      error: error[error.length - 1],
    });
  }

  return res.status(503).json({
    status: false,
    message: "Something Bad Happened",
    error: err?.message,
  });
};

export const zodErrorHandler = (err, req, res, next) => {
  return res.status(400).json({
    status: false,
    message: "Bad Request",
    error: {
      name: `Invalid property ${err?.errors[0]?.path[0]}`,
      message: err?.errors[0]?.message,
    },
  });
};

export const notFound = (req, res, next) => {
  res.status(404).json({
    status: false,
    message: "Not Found",
  });
};
