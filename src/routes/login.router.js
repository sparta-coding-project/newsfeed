import passport from "passport";
import express from "express";
import loginController from "../controllers/login.controller.js";
import { isLoggedIn, isNotLoggedIn } from "../middlewares/login.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();
router.post(
  "/signup",
  isNotLoggedIn,
  upload.single("file"),
  loginController.local.signup
);
router.get("/emailValid", isNotLoggedIn, loginController.local.emailValid);
router.post("/signin", isNotLoggedIn, loginController.local.signin);
router.get("/signout", isLoggedIn, loginController.local.signout);

export default router;
