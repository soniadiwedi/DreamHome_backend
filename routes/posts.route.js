const express=require('express');
const { addPost, getPost, getPosts, updatePost, deletePost } = require('../controller/post.controller');
const { verifyToken } = require('../middleware/verifyToken');
const postRouter=express.Router();

postRouter.post("/add",verifyToken,addPost)
postRouter.get("/",getPosts)
postRouter.get("/:id",getPost)
postRouter.put("/:id",updatePost)
postRouter.delete("/delete/:id",verifyToken,deletePost)

module.exports=postRouter;