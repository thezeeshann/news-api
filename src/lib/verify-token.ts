import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

declare module "express" {
  export interface Request {
    existUser?: string | JwtPayload;
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const token = req.header("Authorization")?.replace("Bearer ", "");
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token || token === undefined) {
      res.status(404).json({
        success: false,
        message: "Token missing",
      });
      return;
    }

    console.log(token, "tokennnnnn");

    // console.log(JSON.stringify(req.headers));

    // if (!token) {
    //   res.status(404).json({
    //     success: false,
    //     message: "Token missing",
    //   });
    //   return;
    // }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    try {
      const decode = jwt.verify(token, jwtSecret) as string | JwtPayload;
      req.existUser = decode;
    } catch (error: unknown) {
      res.status(401).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while verifying the token",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unauthorized",
    });
  }
};
