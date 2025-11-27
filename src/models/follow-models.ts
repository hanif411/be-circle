import { z } from "zod";

export const followValidation = z.object({
  target_follow: z.number(),
});
