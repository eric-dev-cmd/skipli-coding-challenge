import { Request, Response, NextFunction } from "express";
import { config } from "../config";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const payload: any = {
    success: false,
    message: err.message || "Internal Server Error",
  };
  if (config.nodeEnv === "development") {
    payload.stack = err.stack;
  }
  res.status(status).json(payload);
};
