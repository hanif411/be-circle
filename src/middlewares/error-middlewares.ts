import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ZodError) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.issues[0]?.message,
    });
  }
  res.status(500).json({
    code: 500,
    status: "error",
    message: error.message,
    path: error.cause,
    error: error,
  });
};
