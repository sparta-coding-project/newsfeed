import express from "express";
import passport from "passport";
import { isNotLoggedIn } from "../middlewares/login.middleware.js";

const router = express.Router();

router.get("/kakao", passport.authenticate("kakao"))

router.get("kakao/callback", passport.authenticate("kakao", {
    failureRedirect: "/"
}, (req, res) => {
    res.redirect("/")
}))

export default router;