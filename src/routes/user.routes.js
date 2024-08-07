import { Router } from "express";
import {
  LoginUser,
  registerUser,
  fetchUsers,
  deleteUser,
  userData,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewere/multer.middlewere.js";
import { verifyJWT , verifyAdminJWT } from "../middlewere/Auth.middlewere.js";
import multer from "multer";
import { validate } from "../middlewere/validations.middlewere.js";
import { signupSchema } from "../Validations/user.Rej.validations.js";
import { AdminLogin } from "../controllers/Admin.controller.js";
const router = Router();

console.log("validate:", validate); // Should log the validate function
console.log("registerUser:", registerUser); // Should log the registerUser function


router.route("/Register").post(
  (req, res, next) => {
    upload.fields([{ name: "avatar", maxCount: 1 }])(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        next(new ApiError(400, err.message));
      } else if (err) {
        next(err);
      } else {
        next();
      }
    });
  },
  validate(signupSchema),
  registerUser
);

router.route("/fetchUsers").post( verifyAdminJWT , fetchUsers);
router.route("/deleteUser/:id").delete( verifyAdminJWT , deleteUser);

router.route("/Login").post(LoginUser);

// secured Routes
router.route("/userData").post(verifyJWT, userData);
router.route("/AdminLogin").post(AdminLogin) ;

export default router;
