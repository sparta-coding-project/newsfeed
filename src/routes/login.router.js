import passport from "passport";
import express from "express";
import loginController from "../controllers/login.controller.js";
import {
  isLoggedIn,
  isNotLoggedIn,
} from "../middlewares/passport.middleware.js";

const router = express.Router();

router.post("/signup", isNotLoggedIn, loginController.signup);
router.get("/emailValid", isNotLoggedIn, loginController.emailValid);
router.post("/signin", isNotLoggedIn, loginController.signin);
router.get("/signout", isLoggedIn, loginController.signout);

export default router;
