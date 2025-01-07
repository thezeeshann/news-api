import db from "../lib/db";
import { Response, Request } from "express";
import { commentSchema } from "../schema/comment";

export const createComment = async (req: Request, res: Response) => {
  try {
    
    const { userId } = req.existUser as { userId: string };
    const validatedData = commentSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res
        .status(400)
        .json({ success: false, message: validatedData.error.format() });
    }

    const { postId, title } = validatedData.data;

    const comment = await db.comment.create({
      data: {
        title,
        postId,
        userId: userId,
      },
    });

    res.status(201).json({
      success: true,
      message: "comment created successfully",
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};
