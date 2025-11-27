import { Router } from "express";
import { like } from "../controllers/like-controller";
import { authMiddleware } from "../middlewares/auth-middlewares";

const router = Router();

router.post("/", authMiddleware, like);

export default router;
