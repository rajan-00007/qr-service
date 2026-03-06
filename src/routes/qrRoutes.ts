import { Router } from "express";
import { createQRController } from "../controllers/qr.controller";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/create", createQRController);

export default router;