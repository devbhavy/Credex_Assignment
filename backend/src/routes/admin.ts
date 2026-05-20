import express from "express";
const adminRouter = express.Router();
import { PRICING } from "../lib/auditEngine.js";
import { prisma } from "../services/prisma.js";
import { detectPricingChanges } from "../lib/detectPricingChanges.js";

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
            const changes = detectPricingChanges(snapshot,PRICING);

            if(changes.length>0){
                affected.push({
                    auditId : audit.id,
                    shareToken : audit.share_token!,
                    changes
                })
            }
        }

        return res.status(200).json({
            totalAudits : audits.length,
            affectedAudits : affected.length,
            affected
        })
        
    }catch(err){
        return res.status(400).json({
            msg : "Some error occurred fetching data"
        })

    }
})



export {adminRouter}