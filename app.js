import bodyParser from 'body-parser';
import express from 'express';

const app = express()

app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser())

app.listen(process.env.PORT, () => {
    console.log(process.env.PORT)
})