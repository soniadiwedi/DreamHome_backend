const express=require('express');
const { getUsers, getUser, updateUser, deleteUser } = require('../controller/user.controller');
const { verifyToken } = require('../middleware/verifyToken');
const userRouter=express.Router();

userRouter.get("/",getUsers)
userRouter.get("/:id",verifyToken,getUser)
userRouter.put("/:id",verifyToken,updateUser)
userRouter.delete("/:id",verifyToken,deleteUser)


module.exports={userRouter}
