import express from "express";
import { getUserProfile } from "../controllers/profile-controllers";

const router = express.Router();
router.get("/profile/:userId", getUserProfile);

export default router;
