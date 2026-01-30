// import z from "zod";

// export const LoginSchema=z.object({
//     email: z
//     .string()
//     .nonempty({ message: "This cannot be null"})
//     .email({ message: "Email is not valid"})
    

// })
// import { z } from "zod";

// export const LoginSchema = z.object({
//   email: z
//     .string()
//     .email("Please enter a valid email address"),

//   password: z
//     .string()
//     .min(6, "Password must be at least 6 characters"),
// });

import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(1, "Password required"),
});

