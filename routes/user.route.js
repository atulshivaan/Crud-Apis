import express from "express"
import { userRegsiter, userVerification } from "../controllers/user.controller.js";

const userRouter =express.Router();


userRouter.post("/register",userRegsiter)
userRouter.post("/verify-user", userVerification)









export default userRouter