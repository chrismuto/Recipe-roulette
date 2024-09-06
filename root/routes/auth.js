import authController from "../controllers/authController.js";
import express from "express";

const router = express.Router()

router.post('/', authController.handleLogin);

export default router