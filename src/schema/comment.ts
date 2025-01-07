import { z } from "zod";

export const commentSchema = z.object({
  title: z.string().min(3),
  postId: z.string().uuid(),
});

export type commentType = z.infer<typeof commentSchema>;
