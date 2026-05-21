import express from "express";
const adminRouter = express.Router();
import { PRICING } from "../lib/auditEngine.js";
import { prisma } from "../services/prisma.js";
import { detectPricingChanges } from "../lib/detectPricingChanges.js";
import { sendPricingNotificationEmails, type LeadInfo } from "../services/emailHandler.js";

adminRouter.get("/get-pricing",function(req,res){
    return res.status(200).json({
        pricing : PRICING
    })
});

adminRouter.put("/update-pricing",function(req,res){
    const body = req.body;

  const pricingProviders = Object.keys(PRICING);
  const bodyProviders = Object.keys(body);

  for (let i = 0; i < bodyProviders.length; i++) {
    if (!pricingProviders.includes(bodyProviders[i]!)) {
      return res.status(400).json({
        msg: `invalid provider detected!: ${bodyProviders[i]}`
      });
    }
  }

  for (let i = 0; i < bodyProviders.length; i++) {
    const provider:string = bodyProviders[i]!;

    PRICING[provider] = {
      ...PRICING[provider],
      ...body[provider]
    };
  }

  res.status(200).json({
    msg: "changes successful",
    pricing: PRICING
  });
})

adminRouter.get("/detect-changes",async function(req,res){
    try{
        const audits = await prisma.audits.findMany({
            select : {
                id: true,
                share_token: true,
                pricing_snapshot: true,
                tools: true,
                recommendations: true,
            }
        });

        const affected: {
            auditId: string;
            shareToken: string;
            changes: { tool: string; plan: string; oldPrice: number; newPrice: number }[];
        }[] = [];

        for(const audit of audits){
            const snapshot = JSON.parse(audit.pricing_snapshot as string);

            const tools = typeof audit.tools ==="string"?JSON.parse(audit.tools):audit.tools
            const usedTools = tools.map(
              (t: any) => t.tool
            );
            const changes = detectPricingChanges(snapshot,PRICING,usedTools);

            if(changes.length>0){
                affected.push({
                    auditId : audit.id,
                    shareToken : audit.share_token!,
                    changes
                })
            }
        }

        if (affected.length === 0) {
          return res.status(200).json({ msg: "no affected audits, no emails sent" });
        }
        
        const affectedIds = affected.map((data)=>data.auditId);
        
        const leads : LeadInfo[] = await prisma.leads.findMany({
          where :{
            audit_id : {in : affectedIds}
          },
          select : {
            email : true,
            audit_id : true,
            company : true
          }
        })

        
        const {emailsSent,errors}  = await sendPricingNotificationEmails(affected,leads)

        res.status(200).json({
          emailsSent,errors
        })

        // const byEmail: Record<string,{ email: string; company: string | null; audits: typeof affected }> = {};
 
        // for (const lead of leads) {
        //   const email = lead.email!;
        //   const auditData = affected.find((a) => a.auditId === lead.audit_id);
        //   if (!auditData) continue;
    
        //   if (!byEmail[email]) {
        //     byEmail[email] = { email, company: lead.company, audits: [] };
        //   }
        //   byEmail[email].audits.push(auditData);
        // }

        // console.log(byEmail);

        



        // return res.status(200).json({
        //   byEmail
        // })

      
    }catch(err){
        return res.status(400).json({
            msg : "Some error occurred fetching data"
        })

    }
})



export {adminRouter}