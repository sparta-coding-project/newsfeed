import bodyParser from 'body-parser';
import express from 'express';

const app = express()

app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser())

app.listen(process.env.PORT, () => {
    process.env.PORT
})