import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";

const router = Router();

router.route("/Register").post(registerUser)
router.route("/Login").post(registerUser)

export default router