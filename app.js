import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import "dotenv/config"

import loginRouter from './src/routes/login.router.js'

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api", [loginRouter]);

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT);
});
