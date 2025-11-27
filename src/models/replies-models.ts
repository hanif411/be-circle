import { z } from "zod";

export const createReplyValidation = z.object({
  content: z.string(),
});
