const express=require('express')
const { shouldBeLoggedIn, shouldBeAdmin } = require('../controller/test.controller')
const { verifyToken } = require('../middleware/verifyToken')
const testRoute=express.Router()

testRoute.get("/should-be-logged-in",verifyToken,shouldBeLoggedIn)
testRoute.get("/should-be-admin",shouldBeAdmin)

module.exports=testRoute