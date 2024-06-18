import { Router } from "express";
import {
    LoggedOut,
    LoginUser,
    registerUser,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewere/multer.middlewere.js";
import { verifyJWT } from "../middlewere/Auth.middlewere.js";

const router = Router();

    router
    .route("/Register")
    .post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);

  
    router.route("/Login").post(LoginUser);

    // secured Routes
    router.route("/Logout").post(verifyJWT, LoggedOut);
    
export default router;
