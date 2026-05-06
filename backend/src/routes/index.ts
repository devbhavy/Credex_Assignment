import express from "express";
const rootRouter = express.Router();



rootRouter.get("/health",function(req,res){
    res.status(200).json({
        msg : "healthy"
    })
});








export {rootRouter}


