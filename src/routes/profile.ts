import express from "express";
import {
  getUserProfile,
  updateProfile,
} from "../controllers/profile-controllers";
import { verifyToken } from "../lib/verify-token";

const router = express.Router();
router.get("/profile/:userId", getUserProfile);
router.put("/update/:userId", verifyToken, updateProfile);

export default router;
