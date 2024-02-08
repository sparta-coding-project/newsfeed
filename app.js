import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import "dotenv/config"

import loginRouter from './src/routes/login.router.js'

const app = express();

const PORT = process.env.PORT || 3000

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api", [loginRouter]);

app.listen(PORT, () => {
  console.log(PORT);
});
