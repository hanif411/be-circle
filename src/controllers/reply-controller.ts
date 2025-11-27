import { NextFunction, Response, Request } from "express";
import { prisma } from "../utils/prisma";
import { createReplyValidation } from "../models/replies-models";
import cloudinary from "../utils/cloudinary";
import { getio } from "../app";

export const getRepliesThreadDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { thread_id } = req.query;
    if (!thread_id) {
      throw new Error("tidak ada thread id");
    }

    const result = await prisma.replies.findMany({
      where: {
        thread_id: parseInt(thread_id as string, 10),
      },
      orderBy: {
        id: "desc",
      },
      include: {
        created: true,
        _count: {
          select: {
            likes: true,
            childrens: true,
          },
        },
      },
    });

    const response = result.map((r) => ({
      id: r.id,
      content: r.content,
      user: {
        id: r.created.id,
        username: r.created.username,
        name: r.created.full_name,
        profile_picture: r.created.photo_profile,
      },
      created_at: r.created_at,
      replies: r._count.childrens,
      likes: r._count.likes,
    }));

    console.log(result);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Get Data Thread Successfully",
      data: {
        replies: response,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createReply = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { thread_id } = req.query;

    if (!thread_id) {
      throw new Error("tidak ada thread id");
    }
    const user_id = (req as any).user;

    const { content } = createReplyValidation.parse(req.body);

    let image_url: string | null = null;
    if ((req as any).file && (req as any).file.path) {
      const result = await cloudinary.uploader.upload((req as any).file.path);
      image_url = result.url;
    }
    const result = await prisma.replies.create({
      data: {
        user_id: user_id.id,
        content,
        image: image_url,
        created_by: user_id.id,
        thread_id: parseInt(thread_id as string, 10),
      },
      include: {
        created: true,
        _count: {
          select: {
            likes: true,
            childrens: true,
          },
        },
      },
    });

    const response = {
      id: result.id,
      content: result.content,
      user: {
        id: result.created.id,
        username: result.created.username,
        name: result.created.full_name,
        profile_picture: result.created.photo_profile,
      },
      created_at: result.created_at,
      replies: result._count.childrens,
      likes: result._count.likes,
    };

    // await redisClient.del("threads");
    const io = getio();

    io.emit("new_reply", {
      data: response,
      message: "new reply",
    });

    res.status(200).json({
      code: 200,
      status: "success",
      message: "repply berhasil diposting.",
      data: {
        tweet: response,
      },
    });
  } catch (error) {
    next(error);
  }
};
