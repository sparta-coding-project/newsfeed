import passport from "passport";
import { prisma } from "../prisma/index.js";

import local from "./localStrategy.js";
import naver from "./naverStrategy.js";
// import kakao from "./kakaoStrategy.js";

export default () => {
  passport.serializeUser(function (userId, done) {
    done(null, userId);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      const user = await prisma.users.findFirst({
        where: {
          userId: id,
        },
      });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  local();
  naver();
  // kakao();
};
