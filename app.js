import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import commentsRouter from "./src/routes/comments.router.js";
import followRouter from "./src/routes/follow.router.js";
import likesRouter from "./src/routes/likes.router.js";
import loginRouter from "./src/routes/login.router.js";
import naverRouter from "./src/routes/naver.router.js";
import kakaoRouter from "./src/routes/kakao.router.js";
import newsFeedRouter from "./src/routes/newsfeed.router.js";
import profileRouter from "./src/routes/profile.router.js";
import postsRouter from "./src/routes/posts.router.js";

import session from "express-session";
import "dotenv/config";
import passport from "passport";

import passportConfig from "./src/utils/passport/index.js";

const app = express();
passportConfig();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.TOKEN_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
// EJS 템플릿 엔진 설정
app.set("view engine", "ejs");

// EJS 템플릿 파일이 있는 디렉토리 설정 (선택 사항)
app.set("views", "./views");

app.use(express.static(process.env.STATIC_URL));
//프로필 이미지 - 아마존 sw 경로(url)) 들어갈 예정
// app.use(express.static('https://www.aws.s3~/'));

app.use("/api", [
  commentsRouter,
  followRouter,
  likesRouter,
  loginRouter,
  postsRouter,
  newsFeedRouter,
  profileRouter,
]);

app.get("/signup", (req, res) => {
  return res.render("signup", { port: process.env.PORT });
});

app.get("/login", (req, res) => {
  return res.render("login", { port: process.env.PORT });
});

app.get("/main", (req, res) => {
  return res.render("newsfeed", { port: process.env.PORT });
});

app.get("/view_the_post/:postId", (req, res) => {
  return res.render("post", { port: process.env.PORT });
});

app.get("/write_the_post", (req, res) => {
  return res.render("postwriting", { port: process.env.PORT });
});

app.get("/profile/:userProfile", (req, res) => {
  return res.render("profile", { port: process.env.PORT });
});

app.use("/auth", [naverRouter, kakaoRouter]);

app.listen(PORT, () => {
  console.log(PORT);
});
