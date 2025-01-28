import db from "../lib/db";
import { Request, Response } from "express";

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "user not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User fetched successfully",
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

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.existUser as { userId: string };

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        fullName: req.body.fullName,
        username: req.body.username,
        bio: req.body.bio,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
      },
    });

    res.status(201).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};
