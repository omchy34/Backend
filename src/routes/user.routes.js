import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import { upload } from '../middlewere/multer.middlewere.js'

const router = Router();

router.route("/Register").post(
    upload.fields([{ name: 'avatar', maxCount: 1 }]),
    registerUser
);



// router.route("/Login").post(registerUser)
export default router