import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import userRoutes from './routes/userRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'

connectDB()
const app =express()
const port =process.env.PORT || 5000

app.use(express.json())

app.use(cookieParser())

app.use(express.urlencoded({ extended: true }))

app.use('/api/users', userRoutes)

app.get('/',(req,res)=>res.send('server is ready!!!'))

app.use(notFound)
app.use(errorHandler)

app.listen(port,()=>console.log(`server is runnning on port ${port}`))
