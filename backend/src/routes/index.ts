import express from "express";
import { auditRouter } from "./audit.js";
import { leadsRouter } from "./leads.js";
import { adminRouter } from "./admin.js";
const rootRouter = express.Router();



rootRouter.get("/health",function(req,res){
    res.status(200).json({
        msg : "healthy"
    })
});


rootRouter.use("/audit",auditRouter);
rootRouter.use("/lead",leadsRouter);
rootRouter.use("/admin",adminRouter)





export {rootRouter}


