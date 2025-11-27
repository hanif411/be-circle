import { Router } from "express";
import {
  createReply,
  getRepliesThreadDetails,
} from "../controllers/reply-controller";
import { authMiddleware } from "../middlewares/auth-middlewares";
import { upload } from "../utils/multer";

const router = Router();

router.get("/", getRepliesThreadDetails);
router.post("/", authMiddleware, upload.single("image"), createReply);

export default router;
