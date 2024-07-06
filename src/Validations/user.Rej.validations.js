import * as z from "zod";

// Creating an object schema
const signupSchema = z.object({
  fullName: z
    .string({ required_error: "fullName is required" })
    .trim()
    .min(2, { message: "fullName must be at least of 2 characters" })
    .max(255, { message: "Name must not be more than 255 characters" }),
  userName: z
    .string({ required_error: "userName is required" })
    .trim()
    .min(3, { message: "UserName must be at least of 3 characters" })
    .max(255, { message: "UserName must not be more than 255 characters" }),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be at least of 3 characters" })
    .max(255, { message: "Email must not be more than 255 characters" }),
  phone: z
    .string({ required_error: "Phone is required" })
    .trim()
    .min(10, { message: "Phone number must be at least of 10 digit" })
    .max(12, { message: "Phone number must not be more than 10 digit" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(7, { message: "Password must be at least of 6 characters" })
    .max(1024, "Password can't be greater than 1024 characters"),
});

export { signupSchema };
