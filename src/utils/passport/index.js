import passport from "passport";
import { prisma } from "../prisma/index.js";

import naver from "./naverStrategy.js";
import local from "./localStrategy.js";

export default () => {
  passport.serializeUser(function (user, done) {
    done(null, user.userId);
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
};
