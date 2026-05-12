
import express from "express";
import { prisma } from "../services/prisma.js";
import { sendConfirmationEmail } from "../services/emailHandler.js";

const leadsRouter = express.Router();


leadsRouter.post("/capture", async function(req, res) {
  const { auditId, email, company, role } = req.body;

  if (!auditId || !email) {
    return res.status(400).json({ error: "auditId and email are required" });
  }

  try {
    
    const audit = await prisma.audits.findUnique({
      where: { id: auditId }
    });

    if (!audit) {
      return res.status(404).json({ error: "Audit not found" });
    }

    const isHighSavings = Number(audit.total_monthly_saving) > 500;

    const lead = await prisma.leads.create({
      data: {
        audit_id: auditId,
        email,
        company: company ?? null,
        role: role ?? null,
        is_high_savings: isHighSavings,
        email_sent: false
      }
    });


    await sendConfirmationEmail({
      email,
      saving: Number(audit.total_monthly_saving),
      shareToken: audit.share_token!,
      isHighSavings
    });


    await prisma.leads.update({
      where: { id: lead.id },
      data: { email_sent: true }
    });

    return res.status(200).json({
      msg: "Lead captured successfully",
      isHighSavings,
      shareToken: audit.share_token
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export { leadsRouter };