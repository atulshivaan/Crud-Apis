import express from "express"
import dotenv from "dotenv"
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import connectDB from "./utils/db.connection.js";
dotenv.config();


const app =express()
const port =process.env.PORT



//middleware
app.use(morgan("dev"))
app.use(cookieParser())
app.use(express.json())




app.use("/api/user",userRouter)


app.listen(port,(req,res)=>{
    console.log(`Server is running on ${port}`);
    connectDB()
    
})