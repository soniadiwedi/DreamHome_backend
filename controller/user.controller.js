const prisma = require("../lib/prisma");
const bcrypt=require("bcrypt")
const getUsers=async(req,res)=>{

    try{
        const users=await prisma.user.findMany()
        res.status(200).json(users)
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Failed to get users"})
    }
}
const getUser=async(req,res)=>{
    const {id}=req.params
    try{
        const users=await prisma.user.findUnique({
            where:{id:id}
        })
        res.status(200).json(users)
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Failed to get user"})
    }
}

const updateUser=async(req,res)=>{
    const {id}=req.params
    const tokenUserId=req.userId //userId comes from verify middleware where i set the userId
    const {password,avatar,...inputs}=req.body
    if(id!==tokenUserId) return res.status(403).json({message:"Not Athorized"})
    try{
        let updatedPassword=null;
        if(password){
            updatedPassword=await bcrypt.hash(password,10)
        }

        let newUpdatedUser=await prisma.user.update({
            where:{id},
            data:{
                ...inputs,
                ...(updatedPassword&&{password:updatedPassword}),
                ...(avatar && {avatar:avatar})
            }
        })
        const {password:newpassword,...rest}=newUpdatedUser
        res.status(200).json(rest)
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Failed to update user"})
    }
}

const deleteUser=async(req,res)=>{
    const {id}=req.params
    const tokenUserId=req.userId //userId comes from verify middleware where i set the userId
    
    if(id!==tokenUserId) return res.status(403).json({message:"Not Athorized"})
    try{
        await prisma.user.delete({
            where:{id}
        })
        res.status(200).json({message:"user has been deleted"})
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Failed to delete user"})
    }
}


module.exports={getUser,getUsers,updateUser,deleteUser}