// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { verifySessionToken } from "../models/users";

export const verifySession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionToken = req.headers.authorization;

  if (!sessionToken) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing session token" });
  }

  const isValidSession = await verifySessionToken(sessionToken);

  if (!isValidSession) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid session token" });
  }

  next();
};
