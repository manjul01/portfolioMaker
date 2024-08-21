import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
        exposedHeaders : ["Set-Cookie"],
    }
))

app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended:true , limit : "10kb"}))
app.use(cookieParser())

import userRouter from './routes/user.routes.js'
app.use("/api/users", userRouter);

export {app}
