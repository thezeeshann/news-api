import express from "express";
import {
  createPost,
  getPostById,
  getPostByUser,
  getPosts,
  deletePost,
} from "../controllers/post-controller";
import { verifyToken } from "../lib/verify-token";

const router = express.Router();
router.post("/create", verifyToken, createPost);
router.get("/get", getPosts);
router.get("/get-single/:postId", getPostById);
router.get("/get-user", verifyToken, getPostByUser);
router.delete("/delete/:postId", deletePost);
export default router;
