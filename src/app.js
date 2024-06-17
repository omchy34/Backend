import express from "express";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);
app.use(express.static("public"));
app.use(cookieParser());
app.listen(
  express.json({
    limit: "1mb",
  })
);

export { app };
