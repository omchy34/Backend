import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Define CORS options
const allowedOrigins = [
  process.env.FRONTEND_CORS_ORIGIN,
  process.env.ADMIN_CORS_ORIGIN
];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) { // Allow requests with no origin (like Postman)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS')); // Respond with error if origin is not allowed
    }
  },
  methods: "POST, GET, DELETE, PATCH, HEAD, PUT", // Allow these HTTP methods
}));


app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Import routes
import userRouter from './routes/user.routes.js';
import AddItemRouter from "./routes/AddItem.routes.js";
import CartItemRouter from "./routes/Cart.routes.js";
import PromoRouter from "./routes/PromoCodes.routes.js";
import orderRouter from './routes/Order.routes.js';

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/users/Admin", AddItemRouter);
app.use("/api/v1/users", CartItemRouter);
app.use("/api/v1/Admin/", PromoRouter);
app.use("/api/v1/order", orderRouter);

export { app };
