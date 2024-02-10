import express from "express";

import loginController from "../controllers/login.controller.js";

const router = express.Router();

router.post("/signup", loginController.signup);
router.get("/emailValid", loginController.emailValid);
router.post("/signin", loginController.signin);
router.post("/signout", loginController.signout);

export default router;
