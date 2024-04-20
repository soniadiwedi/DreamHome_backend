const express=require('express')
const { authRoute } = require('./routes/auth.route')
const cookiesParser=require("cookie-parser")
const cors=require('cors')
const testRoute = require('./routes/test.route')
const { userRouter } = require('./routes/user.route')
const postRouter = require('./routes/posts.route')

const app=express()
app.use(cors({origin:process.env.CLIENT_URL,credentials:true}))
app.use(express.json())

app.use(cookiesParser())
const port=process.env.PORT||5000

app.use("/api/auth",authRoute)
app.use("/api/test",testRoute)
app.use("/api/users",userRouter)
app.use("/api/posts",postRouter)
app.listen(port,()=>{
    console.log(`server is running on ${port}`);
})

