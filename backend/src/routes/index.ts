import express from "express";
import { auditRouter } from "./audit.js";
import { leadsRouter } from "./leads.js";
const rootRouter = express.Router();



rootRouter.get("/health",function(req,res){
    res.status(200).json({
        msg : "healthy"
    })
});


rootRouter.use("/audit",auditRouter);
rootRouter.use("/lead",leadsRouter)





export {rootRouter}


