import { NextFunction, Response, Request } from "express";
import { prisma } from "../utils/prisma";
import { followValidation } from "../models/follow-models";
import { getio } from "../app";

export const getFollowers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = (req as any).user.id;
  try {
    const followers = await prisma.following.findMany({
      where: {
        following_id: parseInt(userId, 10),
      },
      include: {
        follower: {
          select: {
            id: true,
            full_name: true,
            username: true,
            bio: true,
            photo_profile: true,
          },
        },
      },
    });

    const response = followers.map((f) => ({
      id: f.follower.id,
      username: f.follower.username,
      name: f.follower.full_name,
      bio: f.follower.bio,
      avatar: f.follower.photo_profile,
    }));

    res.status(200).json({
      code: 200,
      message: "succes get followers",
      data: {
        followers: response,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getFollowing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = (req as any).user.id;
  try {
    const followings = await prisma.following.findMany({
      where: {
        follower_id: parseInt(userId, 10),
      },
      include: {
        following: {
          select: {
            id: true,
            full_name: true,
            username: true,
            bio: true,
            photo_profile: true,
          },
        },
      },
    });

    const response = followings.map((f) => ({
      id: f.following.id,
      username: f.following.username,
      name: f.following.full_name,
      bio: f.following.bio,
      avatar: f.following.photo_profile,
    }));

    res.status(200).json({
      code: 200,
      message: "succes get following",
      data: {
        followings: response,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const followUnfollow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = (req as any).user.id;
  const { target_follow } = followValidation.parse(req.body);
  try {
    const isFollow = await prisma.following.findFirst({
      where: {
        follower_id: userId,
        following_id: target_follow,
      },
    });
    if (isFollow) {
      const unFollow = await prisma.following.delete({
        where: {
          id: isFollow.id,
        },
      });

      res.status(200).json({
        code: 200,
        message: "success unfollow",
        data: {
          follower_id: isFollow.follower_id,
          following_id: isFollow.following_id,
          isFollowing: false,
        },
      });

      const io = getio();
      io.emit("unfollow", {
        data: {
          follower_id: isFollow.follower_id,
          following_id: isFollow.following_id,
          isFollowing: false,
        },
        message: "success unfollow",
      });
    } else {
      const follow = await prisma.following.create({
        data: {
          follower_id: userId,
          following_id: target_follow,
        },
      });

      res.status(200).json({
        code: 200,
        message: "success follow",
        data: {
          follower_id: follow.follower_id,
          following_id: follow.following_id,
          isFollowing: true,
        },
      });

      const io = getio();
      io.emit("follow", {
        data: {
          follower_id: follow.follower_id,
          following_id: follow.following_id,
          isFollowing: true,
        },
        message: "succes follow",
      });
    }
  } catch (error) {
    next(error);
  }
};
