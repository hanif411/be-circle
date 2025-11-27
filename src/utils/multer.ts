import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  filename(req, file, callback) {
    const name = Date.now().toString();
    const ext = path.extname(file.originalname);
    callback(null, name + ext);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
