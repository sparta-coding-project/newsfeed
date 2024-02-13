import express from "express";
import passport from "passport";
import { isNotLoggedIn } from "../middlewares/passport.middleware.js";

const router = express.Router();

router.get("/naver", isNotLoggedIn, passport.authenticate("naver", null), function (req, res) {
  // @todo Additional handler is necessary. Remove?
  console.log("/auth/naver failed, stopped");
});

router.get(
  "/naver/callback",
  passport.authenticate("naver", {
    failureRedirect: "#!/auth/login",
  }),
  function (req, res) {
    res.redirect("/");
  }
);

export default router;
