import bodyParser from "body-parser";
import express from "express";
import "dotenv/config"

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api", []);

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT);
});
