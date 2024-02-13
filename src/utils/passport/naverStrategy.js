import passport from "passport";
import { Strategy as NaverStrategy } from "passport-naver";
import { prisma } from "../prisma/index.js";

export default () => {
  passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        callbackURL: "/auth/naver/callback",
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          const exUser = await prisma.users.findFirst({
            where: {
              provider: profile.provider,
              clientId: profile.id,
            },
          });

          if (exUser) {
            if (exUser.clientId === profile.id) {
              return done(null, exUser.userId, { message: "로그인되었습니다." }); // Error: Failed to obtain access token
            } else {
              return done(null, false, {
                message: "사용자 정보가 잘못되었습니다.",
              });
            }
          } else {
            const userData = {
              clientId: profile.id,
              provider: profile.provider,
              email: profile._json.email,
              nickname: profile._json.nickname,
              age: profile._json.age,
            };
            // Error: Failed to serialize user into session
            const newUser = await prisma.users.create({
              data: {
                ...userData,
              },
            });
            return done(null, userData.userId, {
              message: "회원가입이 완료되었습니다.",
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    )
  );
};
