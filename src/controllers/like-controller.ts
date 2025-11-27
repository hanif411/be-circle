import { NextFunction, Response, Request } from "express";
import { likeValidation } from "../models/like-models";
import { prisma } from "../utils/prisma";
import { getio } from "../app";

export const like = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tweet_id } = likeValidation.parse(req.body);
    const user_id = (req as any).user.id;

    const isLike = await prisma.likes.findFirst({
      where: {
        thread_id: tweet_id,
        user_id,
      },
    });

    if (isLike) {
      const unlike = await prisma.likes.delete({
        where: {
          id: isLike.id,
        },
      });

      const io = getio();
      io.emit("like_update", {
        data: { status: "unlike", tweet_id },
        message: "succes unlike",
      });

      return res.status(200).json({
        message: "tweet unliked successfully",
        status: "unlike",
        tweet_id,
        user_id,
      });
    } else {
      const result = await prisma.likes.create({
        data: {
          user_id,
          thread_id: tweet_id,
          created_by: user_id,
        },
      });
      const io = getio();
      io.emit("like_update", {
        data: { status: "like", tweet_id },
        message: "succes like",
      });

      res.status(200).json({
        message: "tweet like successfully",
        status: "like",
        tweet_id: result.thread_id,
        user_id: result.user_id,
      });
    }
  } catch (error) {
    next(error);
  }
};
