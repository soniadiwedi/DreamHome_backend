const prisma = require("../lib/prisma")



const getPosts=async(req,res)=>{
    const query=req.query
    try{
        const posts=await prisma.post.findMany({
            where: {
                city: query.city || undefined,
                type: query.type || undefined,
                property: query.property || undefined,
                bedroom: parseInt(query.bedroom) || undefined,
                price: {
                  gte: parseInt(query.minPrice) || undefined,
                  lte: parseInt(query.maxPrice) || undefined,
                },
              },
        })
        res.status(200).json({message:posts})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Failed to get posts"})
    }
}

const getPost=async(req,res)=>{
    const {id}=req.params
    console.log(id)
    try{
       const post= await prisma.post.findUnique({
        where:{id},
        include:{
            postDetail:true,
            user:{
                select:{
                    username:true,
                    avatar:true
                }
                
            },
        },
        })
        res.status(200).json(post)
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Failed to get post"})
    }
}

const addPost=async(req,res)=>{
    const body=req.body
    const tokenUserId=req.userId

    try{
        const newPost=await prisma.post.create({
            data:{
                ...body.postData,
                userId:tokenUserId,
                postDetail:{
                    create:body.postDetail
                }
            }
        })
        res.status(200).json({message:"New post has been created",newPost})
        
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Failed to add posts"})
    }
}

const updatePost=async(req,res)=>{
    try{

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Failed to update post"})
    }
}

//  const deletePost = async (req, res) => {
//     const id = req.params.id;
//     const tokenUserId = req.userId;
  
//     try {
//       const post = await prisma.post.findUnique({
//         where: { id },
//       });
  
//       if (post.userId !== tokenUserId) {
//         return res.status(403).json({ message: "Not Authorized!" });
//       }
  
//       await prisma.post.delete({
//         where: { id },
//       });
  
//       res.status(200).json({ message: "Post deleted" });
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({ message: "Failed to delete post" });
//     }
//   };
const deletePost = async (req, res) => {
    const { id } = req.params;
    const tokenUserId = req.userId;

    try {
        const post = await prisma.post.findUnique({
            where: { id },
            include: { postDetail: true } // Include PostDetail in the query result
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.userId !== tokenUserId) {
            return res.status(403).json({ message: "Not authorized to delete it" });
        }

        // If the post has associated PostDetail, delete it first
        if (post.postDetail) {
            await prisma.postDetail.delete({
                where: { id: post.postDetail.id }
            });
        }

        // Then delete the Post
        await prisma.post.delete({
            where: { id }
        });

        return res.status(200).json({ message: "Post has been deleted" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to delete post" });
    }
}


module.exports={getPost,getPosts,addPost,updatePost,deletePost};