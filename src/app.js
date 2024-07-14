import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ,
    methods: "POST , GET , DELETE , PATCH , HEAD , PUT",
    credentials: true,
  })
);

app.use(express.json({ limit: "100kb" }));

// app.use(express.urlencoded({ extended: true }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);
app.use(express.static("public"));
app.use(cookieParser());


// import routes
import userRouter from './routes/user.routes.js'
import AddItemRouter from "./routes/AddItem.routes.js";
import CartItemRouter from "./routes/Cart.routes.js"
import PromoRouter from "./routes/PromoCodes.routes.js";

//routes decleartion
app.use("/api/v1/users", userRouter)
app.use("/api/v1/users/Admin", AddItemRouter)
app.use("/api/v1/users", CartItemRouter)
app.use("/api/v1/Admin/", PromoRouter)
export { app };
