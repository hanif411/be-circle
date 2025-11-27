import { z } from "zod";

export interface users {
  username?: String;
  full_name: String;
  email: String;
  password: String;
  photo_profile?: String;
  bio?: String;
}

export const registerValidation = z.object({
  username: z.string().optional(),
  full_name: z.string(),
  email: z.email(),
  password: z.string(),
  bio: z.string().optional(),
});

export const loginValidation = z.object({
  email: z.email(),
  password: z.string(),
});

export const editUserValidation = z.object({
  username: z.string().optional(),
  full_name: z.string().optional(),
  email: z.email().optional(),
  bio: z.string().optional(),
});
