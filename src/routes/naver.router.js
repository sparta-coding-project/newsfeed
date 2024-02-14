import express from "express";
import passport from "passport";
import { isNotLoggedIn } from "../middlewares/login.middleware.js";

const router = express.Router();

router.get("/naver", isNotLoggedIn, passport.authenticate("naver", null), function (req, res) {
  // @todo Additional handler is necessary. Remove?
  console.log("/auth/naver failed, stopped");
});

router.get(
  "/naver/callback", isNotLoggedIn,
  passport.authenticate("naver", {
    failureRedirect: "#!/auth/login",
  }),
  function (req, res) {
    res.redirect("/main");
  }
);

export default router;
