import { NextFunction, Response, Request } from "express";
import {
  editUserValidation,
  loginValidation,
  registerValidation,
} from "../models/users-models";
import { prisma } from "../utils/prisma";
import bcrypt from "bcrypt";
import { signingToken } from "../utils/jwt";
import cloudinary from "../utils/cloudinary";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqBody = registerValidation.parse(req.body);

  const hashedPassword: string = await bcrypt.hash(reqBody.password, 10);
  try {
    const user = await prisma.users.create({
      data: {
        username: reqBody.username === undefined ? null : reqBody.username,
        full_name: reqBody.full_name,
        email: reqBody.email,
        password: hashedPassword,
        bio: reqBody.bio === undefined ? null : reqBody.bio,
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        username: true,
      },
    });

    const token = signingToken(user);
    res.status(200).json({
      code: 200,
      status: "success",
      message: "Registrasi berhasil. Akun berhasil dibuat.",
      data: {
        user_id: user.id,
        username: user.username,
        name: user.full_name,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqBody = loginValidation.parse(req.body);
  try {
    const emailAda = await prisma.users.findUnique({
      where: { email: reqBody.email },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!emailAda) {
      throw new Error("invalid Login");
    }

    const passwordMatch = await bcrypt.compare(
      reqBody.password,
      emailAda.password
    );

    if (!passwordMatch) {
      throw new Error("invalid Login");
    }

    const token = signingToken(emailAda);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Login succesful",
      data: {
        userid: emailAda.id,
        username: emailAda.username,
        name: emailAda.full_name,
        email: emailAda.email,
        avatar: emailAda.photo_profile,
        bio: emailAda.bio,
        followers: emailAda._count.followers,
        following: emailAda._count.following,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user_id = (req as any).user?.id;

  const userIdForQuery = user_id || -1;
  try {
    const result = await prisma.users.findMany({
      where: {
        id: {
          not: userIdForQuery,
        },
      },
      select: {
        id: true,
        username: true,
        full_name: true,
        photo_profile: true,
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });

    const response = result.map((r: any) => ({
      id: r.id,
      username: r.username,
      name: r.full_name,
      avatar: r.photo_profile,
      followers: r._count.followers,
      following: r._count.following,
    }));
    res.status(200).json({
      code: 200,
      message: "success get all users",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const findUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({
      code: 400,
      message: "Keyword is required for search.",
    });
  }

  try {
    const result = await prisma.users.findMany({
      where: {
        OR: [
          {
            full_name: {
              contains: keyword as string,
              mode: "insensitive",
            },
          },
          {
            username: {
              contains: keyword as string,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    const response = result.map((r: any) => ({
      id: r.id,
      username: r.username,
      name: r.full_name,
      avatar: r.photo_profile,
      bio: r.bio,
      followers: r._count.followers,
    }));
    res.status(200).json({
      code: 200,
      message: "succes find user",
      data: {
        users: response,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const editUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userid = (req as any).user.id;
  if (!req.body) {
    throw new Error("tidak ada data yang di isi");
  }
  const { username, full_name, email, bio } = editUserValidation.parse(
    req.body
  );

  try {
    let image_url;

    if ((req as any).file && (req as any).file.path) {
      const result = await cloudinary.uploader.upload((req as any).file.path);
      image_url = result.url;
    }

    const result = await prisma.users.update({
      where: {
        id: userid,
      },
      data: {
        username: username as string,
        full_name: full_name as string,
        email: email as string,
        bio: bio as string,
        photo_profile: image_url as string,
      },
    });

    const response = {
      id: result.id,
      username: result.username,
      full_name: result.full_name,
      email: result.email,
      bio: result.bio,
      avatar: result.photo_profile,
    };

    res.status(200).json({
      code: 200,
      message: "success update user",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserByLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = (req as any).user.id;
  try {
    const result = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });
    const response = {
      id: result?.id,
      username: result?.username,
      full_name: result?.full_name,
      email: result?.email,
      bio: result?.bio,
      avatar: result?.photo_profile,
      followers: result?._count.followers,
      following: result?._count.following,
    };
    res.status(200).json({
      code: 200,
      message: "succes get user by login",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id: number = parseInt(req.params.id as string, 10);
  try {
    const result = await prisma.users.findUnique({
      where: {
        id: id,
      },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });
    const response = {
      id: result?.id,
      username: result?.username,
      full_name: result?.full_name,
      email: result?.email,
      bio: result?.bio,
      avatar: result?.photo_profile,
      followers: result?._count.followers,
      following: result?._count.following,
    };
    res.status(200).json({
      code: 200,
      message: "succes get user by id",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};
