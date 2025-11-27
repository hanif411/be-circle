import { Router } from "express";
import {
  editUser,
  findUsers,
  getUserById,
  getUserByLogin,
  getUsers,
  loginUser,
  registerUser,
} from "../controllers/users-controllers";
import {
  authMiddleware,
  optionalAuthenticate,
} from "../middlewares/auth-middlewares";
import { upload } from "../utils/multer";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", optionalAuthenticate, getUsers);
router.get("/user", authMiddleware, getUserByLogin);
router.get("/user/:id", getUserById);
router.put("/", authMiddleware, upload.single("image"), editUser);
router.get("/search", findUsers);

export default router;
