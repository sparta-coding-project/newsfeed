import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
import postsRouter from "./routes/posts.router.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api", [postsRouter]);

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT);
});
