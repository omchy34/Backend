import { Router } from "express";
import {
    LoggedOut,
    LoginUser,
    refreshAccessToken,
    registerUser,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewere/multer.middlewere.js";
import { verifyJWT } from "../middlewere/Auth.middlewere.js";
import multer from "multer";


const router = Router();

router
  .route("/Register")
  .post((req, res, next) => {
    upload.fields([{ name: "avatar", maxCount: 1 }])(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        next(new ApiError(400, err.message));
      } else if (err) {
        next(err);
      } else {
        next();
      }
    });
  }, registerUser);

  
    router.route("/Login").post(LoginUser);

    // secured Routes
    router.route("/Logout").post(verifyJWT, LoggedOut);
    router.route("/refresh-Token").post(refreshAccessToken)
    
export default router;
