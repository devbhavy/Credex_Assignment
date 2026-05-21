import express from "express"
import { runAudit, type AuditInput,PRICING, type AuditResult } from "../lib/auditEngine.js";
import { generateAiSummary } from "../services/openrouter.js";
import { prisma } from "../services/prisma.js";
const auditRouter = express.Router();
import { buildDiff } from "../lib/auditEngine.js";

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

auditRouter.get("/:shareToken/rerun",async function(req,res){
    const share_token = req.params.shareToken;
    try{
        const originalAudit = await prisma.audits.findFirst({
            where : {
                share_token : share_token
            }
        })

        if(originalAudit == null){
            return res.status(400).json({
                msg : "Error: Audit not found"
            })
        }
        const tools = typeof originalAudit.tools === "string"? JSON.parse(originalAudit.tools): originalAudit.tools;

        const input: AuditInput = {
            tools,
            teamSize: originalAudit.team_size,
            useCase: originalAudit.use_case as AuditInput["useCase"],
            needsAdminControls: originalAudit.needs_admin_controls ?? false,
        };
        const newResult : AuditResult = runAudit(input)
        const aiResponse = await generateAiSummary(newResult);

        const newAudit = await prisma.audits.create({
            data: {
              team_size: originalAudit.team_size,
              use_case: originalAudit.use_case,
              tools: typeof originalAudit.tools === "string" ? originalAudit.tools : JSON.stringify(originalAudit.tools),
              recommendations: JSON.stringify(newResult.recommendations),
              redundancies: JSON.stringify(newResult.redundancies),
              total_monthly_saving: newResult.totalMonthlySaving,
              total_annual_saving: newResult.totalAnnualSaving,
              is_already_optimal: newResult.isAlreadyOptimal,
              summary: aiResponse,
              needs_admin_controls: originalAudit.needs_admin_controls,
              pricing_snapshot: JSON.stringify(PRICING),
              parent_audit_id : originalAudit.id                     
                        
            },
        });

        const originalRecs = typeof originalAudit.recommendations === "string"
      ? JSON.parse(originalAudit.recommendations)
      : originalAudit.recommendations;
 
    const diff = buildDiff(originalRecs, newResult.recommendations);
 
    const savingsDelta = Number(newResult.totalMonthlySaving) - Number(originalAudit.total_monthly_saving);
 
    return res.status(200).json({
      newAuditId: newAudit.id,
      newShareToken: newAudit.share_token,
      savingsDelta,                          
      diff,                                  
      original: {
        recommendations: originalRecs,
        totalMonthlySaving: originalAudit.total_monthly_saving,
        totalAnnualSaving: originalAudit.total_annual_saving,
        summary: originalAudit.summary,
      },
      updated: {
        ...newResult,
        summary: aiResponse,
      },
    });
  } catch (err) {
    console.error("rerun error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});


    


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