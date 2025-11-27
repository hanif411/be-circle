import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  const tokenHeader = req.headers.token;
  if (!token && !tokenHeader) {
    throw new Error("unauthorized");
  }
  const decoded = verifyToken(token || tokenHeader);
  (req as any).user = decoded;
  next();
  try {
  } catch (error) {
    next(error);
  }
};

export const optionalAuthenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  const tokenHeader = req.headers.token;

  if (!token && !tokenHeader) {
    (req as any).user = undefined;
    return next();
  }
  try {
    const decoded = verifyToken(token || tokenHeader);
    (req as any).user = decoded;
    next();
  } catch (error) {
    (req as any).user = undefined;
    next();
  }
};
