import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes/userRoutes.js";
import cookieParser from 'cookie-parser';
import mpesaRouter from "./routes/mpesaRoutes.js";
import cors from "cors";

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser())


app.use('/user', router)
app.use('/mpesa', mpesaRouter)

app.use((error, request, response, next) => {
    const message = error.message || "Server Error";
    const status = error.status || 500
    return response.status(status).json({
        "message": message,
        "status": status,
        "stack": error.stack
    })
})

mongoose.connection.on('connected', () => {
    console.log("Connection to DB was successful")
})
mongoose.connection.on('disconnected', () => {
    console.log("Connection to DB was disconnected")
})

mongoose.connect(process.env.MONGODB).then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is listening on port ${process.env.PORT}`)
    })
})
