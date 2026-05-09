import express from "express"
import { runAudit, type AuditInput } from "../lib/auditEngine.js";
import { generateAiSummary } from "../lib/openrouter.js";
import { prisma } from "../lib/prisma.js";
const auditRouter = express.Router();


auditRouter.post("/create",async function(req,res){
    const body : AuditInput = req.body;
    
    
    const response = runAudit(body);
    


    try{
        const aiResponse = await generateAiSummary(response);
        await prisma.audits.create({
            data : {
                team_size : body.teamSize,
                use_case : body.useCase,
                tools : JSON.stringify(body.tools),
                recommendations : JSON.stringify(response.recommendations),
                redundancies : JSON.stringify(response.redundancies),
                total_monthly_saving : response.totalMonthlySaving,
                total_annual_saving : response.totalAnnualSaving,
                is_already_optimal : response.isAlreadyOptimal,
                summary : aiResponse,
                needs_admin_controls : body.needsAdminControls
            }
        });
        res.status(200).json({...response,summary : aiResponse});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
})

auditRouter.get("/:id",function(req,res){
    
})

auditRouter.get("/:id/public",function(req,res){

})



export {auditRouter}