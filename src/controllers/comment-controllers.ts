import db from "../lib/db";
import { Response, Request } from "express";
import { commentSchema } from "../schema/comment";

export const createComment = async (req: Request, res: Response) => {
  try {
    const { userId } = req.existUser as { userId: string };
    const validatedData = commentSchema.safeParse(req.body);

    if (!validatedData.success) {
      res
        .status(400)
        .json({ success: false, message: validatedData.error.format() });
      return;
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

export const getComments = async (req: Request, res: Response) => {
  try {
    const comments = await db.comment.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        Post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    if (!comments) {
      res.status(404).json({
        success: false,
        message: "No comments found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const getCommentsById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const comment = await db.comment.findUnique({
      where: { id: commentId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        Post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    if (!comment) {
      res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment fetched successfully",
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const getCommentByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.existUser as { userId: string };
    const comments = await db.comment.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        Post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!comments) {
      res.status(404).json({
        success: false,
        message: "No comments found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;

    const comment = await db.comment.findUnique({ where: { id: commentId } });

    if (!comment) {
      res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    await db.comment.delete({ where: { id: commentId } });

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};
