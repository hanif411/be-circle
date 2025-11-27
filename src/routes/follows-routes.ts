import { Router } from "express";
import {
  followUnfollow,
  getFollowers,
  getFollowing,
} from "../controllers/follow-controller";
import { authMiddleware } from "../middlewares/auth-middlewares";

const router = Router();

router.get("/", authMiddleware, getFollowers);
router.get("/following", authMiddleware, getFollowing);
router.post("/", authMiddleware, followUnfollow);

export default router;
