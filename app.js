import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import postsRouter from "./src/routes/posts.router.js";
import loginRouter from "./src/routes/login.router.js";
import commentsRouter from "./src/routes/comments.router.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// EJS 템플릿 엔진 설정
app.set("view engine", "ejs");

// EJS 템플릿 파일이 있는 디렉토리 설정 (선택 사항)
app.set("views", "./views");

app.use("/api", [postsRouter, commentsRouter, loginRouter]);

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT);
});
