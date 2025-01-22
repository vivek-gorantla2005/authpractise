import express from "express";
import { registerUser } from "../controllers/UserController";

const router = express.Router();

router.post("/auth/signup", registerUser);

export default router;
