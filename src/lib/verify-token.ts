import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

declare module "express" {
  export interface Request {
    existUser?: string | JwtPayload;
  }
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    res.status(404).json({
      success: false,
      message: "Token missing",
    });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    res.status(500).json({
      success: false,
      message: "JWT_SECRET is not defined in the environment variables",
    });
    return;
  }

  try {
    const decode = jwt.verify(token, jwtSecret) as string | JwtPayload;
    req.existUser = decode;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while verifying the token",
    });
    return;
  }
};
