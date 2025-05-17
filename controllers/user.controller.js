import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import { generateToken } from "../utils/generateToken.js";


export const userRegsiter = async (req, res) => {
  const { name, email, password, department, role, age } = req.body;
  try {
    if (!name || !email || !password || !department || !role || !age) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const emailExist = await User.findOne({ email });

    if (emailExist) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists",
      });
    }
    const hashPassword = await bcrypt.hash(password,10)
  const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 mins

const newUser = await User.create({
  name,
  email,
  password: hashPassword,
  department,
  role,
  age,
  verificationCode,
  verificationExpires,
});
   
    const token  = await generateToken(newUser._id)
    res.status(201).json({
        success:true,
        message:"User Regsitered Succesfully",
        user:{
            id:newUser._id,
            name:newUser.name,
            email:newUser.email,
            department:newUser.department,
            age:newUser.age,
            role:newUser.role
        },
        token
    })

  } catch (error) {
      console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

export const userVerification = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User is already verified",
      });
    }

    if (
      user.verificationCode === code &&
      user.verificationExpires > new Date()
    ) {
      user.isVerified = true;
      user.verificationCode = undefined;
      user.verificationExpires = undefined;

      await user.save();

      return res.status(200).json({
        success: true,
        message: "User verified successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired code",
      });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};