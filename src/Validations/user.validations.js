
import * as z from 'zod';

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
    .min(3, { message: "Name must be at least of 3 characters" })
    .max(255, { message: "Name must not be more than 255 characters" }),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be at least of 3 characters" })
    .max(255, { message: "Email must not be more than 255 characters" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(7, { message: "Password must be at least of 6 characters" })
    .max(1024, "Password can't be greater than 1024 characters"),
});

export { signupSchema };