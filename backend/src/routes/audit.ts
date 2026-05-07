import express from "express"
const auditRouter = express.Router();


auditRouter.get("/",function(req,res){
    res.status(200).json({
        msg : "audit router working!"
    })
})




export {auditRouter}