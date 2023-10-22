import z from "zod";

export const createUserBody = z.object({
  name: z.string({ required_error: "The name is required" }),
  email: z.string({ required_error: "The email is required" }).email(),
  password: z
    .string({ required_error: "The password is required" })
    .min(6, { message: "The password must be 6 or more characters" }),
});

export const signInBody = z.object({
  email: z.string({ required_error: "The email is required" }).email(),
  password: z.string({ required_error: "The password is required" }),
});

export const authorizationHeaderSchema = z.object({
  authorization: z.string().refine((value) => value.startsWith("Bearer "), {
    message: "Invalid token",
  }),
});

export const editUserBody = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export const editPasswordBody = z.object({
  password: z.optional(
    z.string().min(6, { message: "The password must be 6 or more characters" })
  ),
  oldPassword: z.optional(z.string()),
});
