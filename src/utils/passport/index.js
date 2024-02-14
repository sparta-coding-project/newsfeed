import passport from "passport";
import { prisma } from "../prisma/index.js";

import local from "./localStrategy.js";
import naver from "./naverStrategy.js";

export default () => {
  passport.serializeUser(function (userId, done) {
    console.log("s3 - index.js 1");
    done(null, userId);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      console.log("s3 - index.js 2");
      const user = await prisma.users.findUnique({
        where: {
          userId: id,
        },
      });
      console.log("s3 - index.js 3");
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  //얘네 둘이 제일 먼저 로딩됨
  local();
  console.log("s3 - index.js 4");
  naver();
  console.log("s3 - index.js 5");
};
