const { register, login, logout } = require("../controller/auth.controller");
const express=require('express')

 
const authRoute=express.Router();

authRoute.post("/register",register)
authRoute.post("/login",login)
authRoute.post("/logout",logout)

module.exports={authRoute}