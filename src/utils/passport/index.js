import passport from "passport";
import { prisma } from "../prisma/index.js";

import local from "./localStrategy.js";
import naver from "./naverStrategy.js";

export default () => {
  passport.serializeUser(function (userId, done) {
    done(null, userId);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      const user = await prisma.users.findUnique({
        where: {
          userId: id,
        },
      });

      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  //얘네 둘이 제일 먼저 로딩됨
  local();
  naver();
};
