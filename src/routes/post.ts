import express from "express";
import {
  createPost,
  getPostById,
  getPosts,
} from "../controllers/post-controller";
import { verifyToken } from "../lib/verify-token";

const router = express.Router();
router.post("/create", verifyToken, createPost);
router.get("/get", getPosts);
router.get("/get-single/:postId", getPostById);
export default router;
