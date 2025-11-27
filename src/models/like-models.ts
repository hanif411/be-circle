import { z } from "zod";

export const likeValidation = z.object({
  tweet_id: z.number(),
});
