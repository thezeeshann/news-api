import express from "express";
import {
  createComment,
  getComments,
  getCommentsById,
  getCommentByUser,
} from "../controllers/comment-controllers";
import { verifyToken } from "../lib/verify-token";

const router = express.Router();
router.post("/create", verifyToken, createComment);
router.get("/get", getComments);
router.get("/get-single/:commentId", getCommentsById);
router.get("/get-user", verifyToken, getCommentByUser);

export default router;
