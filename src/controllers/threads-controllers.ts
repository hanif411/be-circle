import { NextFunction, Response, Request } from "express";
import { prisma } from "../utils/prisma";
import { createThreadValidation } from "../models/threads-models";
import cloudinary from "../utils/cloudinary";
import { getio } from "../app";
import pLimit from "p-limit";

const limit = pLimit(10);
import redisClient from "../utils/redis";

export const getThreads = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = (req as any).user?.id;
    const userIdForQuery = user_id || -1;
    const resultredis = await redisClient.get("threads");

    if (resultredis) {
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Get Data Thread Successfully from redis",
        data: {
          threads: JSON.parse(resultredis),
        },
      });
    }

    const result = await prisma.threads.findMany({
      include: {
        created: true,
        _count: {
          select: {
            replies: true,
            likes: true,
          },
        },
        likes: {
          where: {
            user_id: userIdForQuery,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });
    if (!result) {
      throw new Error("thread not found");
    }

    const response = result.map((r) => ({
      id: r.id,
      content: r.content,
      image: r.image,
      media_type: r.media_type,
      user: {
        id: r.created.id,
        username: r.created.username,
        name: r.created.full_name,
        profile_picture: r.created.photo_profile,
      },
      created_at: r.created_at,
      likes: r._count.likes,
      replies: r._count.replies,
      islike: r.likes.length > 0,
    }));

    const resultredist = await redisClient.set(
      "threads",
      JSON.stringify(response),
      {
        EX: 60,
        NX: true,
      }
    );

    // console.log(resultredist);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Get Data Thread Successfully from DB",
      data: {
        threads: response,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getThreadById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id: number = parseInt(req.params.id as string, 10);

  try {
    const result = await prisma.threads.findUnique({
      where: {
        id,
      },
      include: {
        created: true,
        replies: true,
        _count: {
          select: {
            replies: true,
            likes: true,
          },
        },
      },
    });

    if (!result) {
      throw new Error("thread not found");
    }

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Get Data Thread Successfully",
      data: {
        id: result.id,
        content: result.content,
        image: result.image,
        media_type: result.media_type,
        user: {
          id: result.created.id,
          username: result.created.username,
          name: result.created.full_name,
          profile_picture: result.created.photo_profile,
        },
        created_at: result.created_at,
        likes: result._count.likes,
        replies: result._count.replies,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createThread = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqBody = createThreadValidation.parse(req.body);

  let image_url: string | null = null;
  let media_type: string | null = null;
  if ((req as any).file && (req as any).file.path) {
    const result = await cloudinary.uploader.upload((req as any).file.path, {
      resource_type: "auto",
      folder: "circle app",
    });
    image_url = result.secure_url;
    media_type = result.resource_type;
  }

  try {
    const result = await prisma.threads.create({
      data: {
        content: reqBody.content,
        image: image_url,
        media_type,
        created_by: (req as any).user.id,
      },
      include: {
        created: true,
        _count: {
          select: {
            replies: true,
            likes: true,
          },
        },
      },
    });

    if (!result) {
      throw new Error("Invalid thread content");
    }

    const response = {
      id: result.id,
      content: result.content,
      image: result.image,
      media_type: result.media_type,
      user: {
        id: result.created.id,
        username: result.created.username,
        name: result.created.full_name,
        profile_picture: result.created.photo_profile,
      },
      created_at: result.created_at,
      likes: result._count.likes,
      replies: result._count.replies,
    };

    await redisClient.del("threads");

    const io = getio();

    io.emit("new_thread", {
      data: response,
      message: "tew thread",
    });

    res.status(200).json({
      code: 200,
      status: "succes",
      message: "Thread berhasil diposting.",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const createThreadMulti = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqBody = createThreadValidation.parse(req.body);

  let image_url: string | null = null;
  let media_type: string | null = null;

  const imageMulti = (req as any).files.map((f: { path: any }) => f.path);

  const imageUpload = imageMulti.map((image: string) => {
    return limit(async () => {
      const result = await cloudinary.uploader.upload(image);
      return result;
    });
  });

  let upload = await Promise.all(imageUpload);

  console.log(upload);
  const images = upload.map((u) => {
    return u.secure_url;
  });
  console.log(images);

  try {
    const result = await prisma.threads.create({
      data: {
        content: reqBody.content,
        image: JSON.stringify(images),
        media_type,
        created_by: (req as any).user.id,
      },
      include: {
        created: true,
        _count: {
          select: {
            replies: true,
            likes: true,
          },
        },
      },
    });

    if (!result) {
      throw new Error("Invalid thread content");
    }

    const response = {
      id: result.id,
      content: result.content,
      image: result.image,
      media_type: result.media_type,
      user: {
        id: result.created.id,
        username: result.created.username,
        name: result.created.full_name,
        profile_picture: result.created.photo_profile,
      },
      created_at: result.created_at,
      likes: result._count.likes,
      replies: result._count.replies,
    };

    await redisClient.del("threads");

    const io = getio();

    io.emit("new_thread", {
      data: response,
      message: "tew thread",
    });

    res.status(200).json({
      code: 200,
      status: "succes",
      message: "Thread berhasil diposting.",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getThreadByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userid = (req as any).user.id;

    const threads = await prisma.threads.findMany({
      where: {
        created_by: parseInt(userid, 10),
      },
      include: {
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
        likes: {
          select: {
            id: true,
          },
        },
      },
    });

    const response = threads.map((r) => ({
      id: r.id,
      content: r.content,
      image: r.image,
      media_type: r.media_type,
      created_at: r.created_at,
      likes: r._count.likes,
      replies: r._count.replies,
      islike: r.likes.length > 0,
    }));

    res.status(200).json({
      code: 200,
      message: "success  get thread by user",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getThreadByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id: number = parseInt(req.params.id as string, 10);
    const threads = await prisma.threads.findMany({
      where: {
        created_by: id,
      },
      include: {
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
        likes: {
          select: {
            id: true,
          },
        },
      },
    });

    const response = threads.map((r) => ({
      id: r.id,
      content: r.content,
      image: r.image,
      media_type: r.media_type,
      created_at: r.created_at,
      likes: r._count.likes,
      replies: r._count.replies,
      islike: r.likes.length > 0,
    }));

    res.status(200).json({
      code: 200,
      message: "success  get thread by user",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};
