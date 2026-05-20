import express from "express"
import { runAudit, type AuditInput,PRICING } from "../lib/auditEngine.js";
import { generateAiSummary } from "../services/openrouter.js";
import { prisma } from "../services/prisma.js";
const auditRouter = express.Router();


auditRouter.post("/create",async function(req,res){
    const body : AuditInput = req.body;
    
    
    const response = runAudit(body);
    


    try{
        const aiResponse = await generateAiSummary(response);
        const audit = await prisma.audits.create({
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
                needs_admin_controls : body.needsAdminControls,
                pricing_snapshot : JSON.stringify(PRICING)
            }
        });
        res.status(200).json({...response,summary : aiResponse,auditId : audit.id});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
})


auditRouter.get("/:shareToken/public",async function(req,res){
    const shareToken = req.params.shareToken;
    try{
        const audit = await prisma.audits.findUnique({
           where : {
            share_token : shareToken
           }
        });
        if(audit==null){
            return res.status(200).json({msg : "no audit data for for the given id!"})
        }
        const { id: _id, share_token: _shareToken, ...publicAudit } = audit;
        return res.status(200).json(publicAudit)
        
    }catch(err){
        return res.status(300).json({
            msg : "some error occurred while fetching from the database!"
        })
    }


})


auditRouter.get("/:id",async function(req,res){
    const auditId = req.params.id;
    try{
        const response = await prisma.audits.findUnique({
           where : {
            id : auditId
           }
        });
        if(response==null){
            return res.status(404).json({msg : "no audit data for for the given id!"})
        }else{
            return res.status(200).json(response)
        }
        
    }catch(err){
        return res.status(500).json({
            msg : "some error occurred while fetching from the database!"
        })
    }
    
})




export {auditRouter}