const bcrypt = require('bcrypt');
const prisma = require("../lib/prisma.js");
const jwt=require("jsonwebtoken")
require('dotenv').config()


const register = async (req, res) => {
    const { username, email, password } = req.body;
  
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      const newUser = await prisma.user.create({
        data: {
          username: username,
          email: email,
          password: hashedPassword,
        },
      });
      res.status(200).json({ message: "User has been registered.", newUser });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "An error occurred while registering the user." });
    }
  };
  

const login = async (req, res) => {
    const {username,password}=req.body
    try{
        const user= await prisma.user.findUnique({where:{username:username}})
        if(!user) res.status(400).json({ message: "Invalid Credentials!" });

        const isPasswordCheck=await bcrypt.compare(password,user.password)
        if(!isPasswordCheck) res.status(400).json({ message: "Invalid Credentials!" });
        // GENERATE COOKIE TOKEN AND SEND TO THE USER
           //      milliseconds minutes hours days days
           const age=1000*60*60*24*7
        const token=jwt.sign({
            id:user.id,
            isAdmin:false,   
        },process.env.JWT_SECRET_KEY,{expiresIn:age})

        const { password: userPassword, ...userInfo } = user;

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:age
        }).status(200).json({message:"Login Successful",userInfo})

    }catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "An error occurred while login the user." });
    }
};

const logout = async (req, res) => {
    res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};

module.exports = { register, login, logout };
