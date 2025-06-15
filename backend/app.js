import express from 'express'
import cors from "cors"
import dotenv from 'dotenv'
import router from './routes/router.js'
import {dbconnection} from './database/dbconnection.js'
import cookieParser from 'cookie-parser';

const app=express()
dotenv.config({path:"./config/config.env"})
app.use(cookieParser());

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(
    cors({
        origin:[process.env.FRONTEND_URL],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
)

app.use('/ab/cd',router)

dbconnection();

export default app