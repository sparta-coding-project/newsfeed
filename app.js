import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";
import "dotenv/config";
import passport from "passport";

import loginRouter from "./src/routes/login.router.js";
import naverRouter from "./src/routes/naver.router.js";

import passportConfig from "./src/utils/passport/index.js";

const app = express();
passportConfig();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.TOKEN_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", [loginRouter]);
app.get("/session", (req, res, next) => {
  passport.authenticate('naver', (error, user, info) => {
    console.log(user)
    return res.status(200).json({message: "안녕하세요"})
  })
});
app.use("/auth", [naverRouter]);
app.get("/", (req, res) => res.send("hi"));

app.listen(PORT, () => {
  console.log(PORT);
});
