import refreshTokenController from "../controllers/refreshTokenController.js";
import express from "express";

const router = express.Router();

router.get('/', refreshTokenController.handleRefreshToken);

export default router;