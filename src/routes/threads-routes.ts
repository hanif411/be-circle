import { Router } from "express";
import {
  createThread,
  createThreadMulti,
  getThreadById,
  getThreadByUser,
  getThreadByUserId,
  getThreads,
} from "../controllers/threads-controllers";
import {
  authMiddleware,
  optionalAuthenticate,
} from "../middlewares/auth-middlewares";
import { upload } from "../utils/multer";

const router = Router();

router.get("/user", authMiddleware, getThreadByUser);
router.get("/user/:id", getThreadByUserId);
router.get("/", optionalAuthenticate, getThreads);
router.post("/", authMiddleware, upload.single("image"), createThread);
router.post("/multi", authMiddleware, upload.array("image"), createThreadMulti);
router.get("/:id", getThreadById);

export default router;
