import * as zod from "zod";

export const RegisterSchemaObject = zod
  .object({
    name: zod
    .string()
    .nonempty("Full name is required.")
    .min(2, "min char 2 char")
    .max(15, "max chars 15"),
    username: zod
    .string()
    .min(2, "min char 2 char")
    .max(15, "max chars 15")
    .optional().or(zod.literal("")),
    email: zod
    .string()
    .nonempty("Email is required.")
    .email("not valid email"),
    gender: zod
    .enum(["male", "female"],
     { error: "Gender is required." }),
    password: zod
      .string()
      .nonempty("Password is required.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "min 8 chars, upper, lower, number and symbol"),
    rePassword: zod
     .string()
     .nonempty("Please confirm your password."),
       dateOfBirth: zod
      .string()
      .nonempty("Date of birth is required.")
      .refine((data) => {
        const myYear = new Date(data).getFullYear();
        const thisYear = new Date().getFullYear();
        return thisYear - myYear > 10;
      }, "age > 10"),
  })
    .refine(
        (data) => { return data.password === data.rePassword;
   },
   {
    error: 'dont match',
    path: ["rePassword"],
  },
);

  export type RegisterSchema = zod.infer<typeof RegisterSchemaObject>;