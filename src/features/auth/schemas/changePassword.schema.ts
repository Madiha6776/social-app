import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const changePasswordScheme = z
  .object({
    password: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .regex(passwordRegex, "At least 8 characters with uppercase, lowercase, number and symbol"),
    rePassword: z.string(),
  })
  .refine((data) => data.newPassword === data.rePassword, {
    message: "Passwords don't match",
    path: ["rePassword"],
  })
  .refine((data) => data.password !== data.newPassword, {
    message: "New password must be different",
    path: ["newPassword"],
  });

export type ChangePasswordSchemeType = z.infer<typeof changePasswordScheme>;
