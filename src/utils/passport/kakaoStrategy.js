import passport from "passport";
import { Strategy as KakaoStrategy } from "passport-kakao";

export default () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_CLIENT_ID,
        callbackURL: "/auth/kakao/callback",
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
              return done(null, exUser.userId, {
                message: "로그인되었습니다.",
              }); // Error: Failed to obtain access token
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
            return done(null, newUser.userId, {
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
