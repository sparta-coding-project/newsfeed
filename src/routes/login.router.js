import passport from "passport";
import express from "express";
import loginController from "../controllers/login.controller.js";
import { isLoggedIn, isNotLoggedIn } from "../middlewares/login.middleware.js";

const router = express.Router();
console.log("여길 먼저 오겠네1");
router.post("/signup", isNotLoggedIn, loginController.local.signup);
console.log("여길 먼저 오겠네2");
router.get("/emailValid", isNotLoggedIn, loginController.local.emailValid);
console.log("여길 먼저 오겠네3");
router.post("/signin", isNotLoggedIn, loginController.local.signin);
console.log("여길 먼저 오겠네4");
router.get("/signout", isLoggedIn, loginController.local.signout);
console.log("여길 먼저 오겠네5");

export default router;
