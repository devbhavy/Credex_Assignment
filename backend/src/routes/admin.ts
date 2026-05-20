import express from "express";
const adminRouter = express.Router();
import { PRICING } from "../lib/auditEngine.js";

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





export {adminRouter}