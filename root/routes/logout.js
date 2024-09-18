import logoutController from "../controllers/logoutController.js";
import express from "express";

const router = express.Router();

router.get('/', logoutController.handleLogout);

export default router;