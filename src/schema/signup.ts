import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().min(5).max(50),
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  profile: z.string().optional(),
  dateOfBirth: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  bio: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
});

export type signupType = z.infer<typeof signupSchema>;
