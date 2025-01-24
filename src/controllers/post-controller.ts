import db from "../lib/db";
import { Request, Response } from "express";
import { postSchema } from "../schema/post";
import { uploadImageToCloudinary } from "../lib/upload-image";
import dotenv from "dotenv";
dotenv.config();

export const createPost = async (req: Request, res: Response) => {
  try {
    const { userId } = req.existUser as { userId: string };
    const validatedData = postSchema.safeParse(req.body);

    if (!req.files || !req.files.image) {
      res.status(400).json({
        success: false,
        message: "Files are missing",
      });
      return;
    }

    const imgFile = Array.isArray(req.files.image)
      ? req.files.image[0]
      : req.files.image;

    if (!imgFile.tempFilePath) {
      res.status(400).json({
        success: false,
        message: "Invalid file upload",
      });
      return;
    }

    if (!validatedData.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validatedData.error.format(),
      });
    } else {
      const { content, title } = validatedData.data;
      const uploadImageFile = await uploadImageToCloudinary({
        file: { tempFilePath: imgFile.tempFilePath },
        folder: process.env.FOLDER_NAME || "",
      });

      const post = await db.post.create({
        data: {
          title,
          content,
          image: uploadImageFile.secure_url,
          authorId: userId,
        },
      });

      res.status(201).json({
        success: true,
        message: "post created successfully",
        data: post,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await db.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            profile: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!posts) {
      res.status(404).json({
        success: false,
        message: "No posts found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const post = await db.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      res.status(404).json({
        success: false,
        message: "Post not found",
      });
    } else {
      res.json({
        success: true,
        message: "Post fetched successfully",
        data: post,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const getPostByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.existUser as { userId: string };

    const posts = await db.post.findMany({
      where: { authorId: userId },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            profile: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const post = await db.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
      },
    });

    if (!post) {
      res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    await db.post.delete({ where: { id: postId } });

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};
