import { z } from "zod";

export const createThreadValidation = z.object({
  content: z.string(),
});
