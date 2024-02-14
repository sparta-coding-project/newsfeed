import express from "express";
import passport from "passport";
import { isNotLoggedIn } from "../middlewares/login.middleware.js";

const router = express.Router();

router.get(
  "/naver",
  isNotLoggedIn,
  passport.authenticate("naver", null),
  function (req, res) {
    // @todo Additional handler is necessary. Remove?
    console.log("/auth/naver failed, stopped");
  }
);

router.get(
  "/naver/callback",
  isNotLoggedIn,
  passport.authenticate("naver", {
    failureRedirect: "/auth/naver",
  }),
  function (req, res) {
    console.log("s4 - naver.router 1");
    return res.status(200).redirect("/main");
    // return res.status(200).json({ message: "로그인에 성공했습니다." });
  }
);

export default router;
