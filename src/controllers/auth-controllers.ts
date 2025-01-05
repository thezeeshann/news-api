import db from "../lib/db";
import { Request, Response } from "express";
import { signupSchema } from "../schema/signup";
import { signinSchema } from "../schema/signin";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

export const signup = async (req: Request, res: Response) => {
  try {
    const validatedData = signupSchema.safeParse(req.body);
    if (!validatedData.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validatedData.error.format(),
      });
    } else {
      const {
        fullName,
        email,
        password,
        username,
        bio,
        dateOfBirth,
        gender,
        profile,
      } = validatedData.data;

      const existUser = await db.user.findUnique({
        where: {
          email: email,
        },
      });

      if (existUser) {
        res.status(400).json({
          success: false,
          message: "User already exists",
        });
        return;
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const user = await db.user.create({
        data: {
          fullName,
          email,
          password: hashPassword,
          username,
          bio,
          dateOfBirth,
          gender,
          profile,
        },
      });

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const validatedData = signinSchema.safeParse(req.body);
    if (!validatedData.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validatedData.error.format(),
      });
    } else {
      const { email, password } = validatedData.data;

      const existUser = await db.user.findFirst({
        where: {
          email: email,
        },
      });

      if (!existUser) {
        res.status(404).json({
          success: false,
          message: "User does not exist",
        });
        return;
      }

      const decodePassword = await bcrypt.compare(password, existUser.password);

      if (!decodePassword) {
        res.status(401).json({
          success: false,
          message: "Invalid password",
        });
        return;
      }

      const payload = {
        userId: existUser.id, 
        email: existUser.email,
      };

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error(
          "JWT_SECRET is not defined in the environment variables"
        );
      }

      const token = jwt.sign(payload, jwtSecret, {
        expiresIn: "7d",
      });

      res.status(200).json({
        success: true,
        message: "Login successful",
        existUser,
        token,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};
