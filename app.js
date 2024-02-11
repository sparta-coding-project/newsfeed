import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";
import "dotenv/config";

import loginRouter from "./src/routes/login.router.js";
import authMiddleware from "./src/middlewares/auth.middleware.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.TOKEN_SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
  }
}));

app.use("/api", [loginRouter]);
app.get("/session", authMiddleware)

app.listen(PORT, () => {
  console.log(PORT);
});
