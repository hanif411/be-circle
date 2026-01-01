import express from "express";
import userRouter from "./routes/users-routes";
import threadsRouter from "./routes/threads-routes";
import replyRouter from "./routes/reply-routes";
import likeRouter from "./routes/like-routes";
import followsRouter from "./routes/follows-routes";
import { errorMiddleware } from "./middlewares/error-middlewares";
import cors from "cors";
import { corsOptions } from "./utils/cors";
import cookieparser from "cookie-parser";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger/swagger.config";

export const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieparser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/thread", threadsRouter);
app.use("/api/v1/reply", replyRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/follows", followsRouter);

app.use(errorMiddleware);

import http from "http";
import { Server } from "socket.io";
const httpServer = http.createServer(app);

let io;

io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3001",
      "https://circle-fe.vercel.app",
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
  });
});

export const getio = () => {
  if (!io) {
    throw new Error("tidak ada web socke io");
  }
  return io;
};

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log("Server running on port 3000");
});

export default app;
