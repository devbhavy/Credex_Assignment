import { BrevoClient } from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

function getBrevo(): BrevoClient {
  const apiKey = process.env.BREVO_PASS;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is required for transactional email");
  }
  return new BrevoClient({ apiKey });
}

// ─── Confirmation email (existing) ───────────────────────────────────────────

interface PropType {
  email: string;
  saving: number;
  shareToken: string;
  isHighSavings: boolean;
}

export async function sendConfirmationEmail(props: PropType) {
  try {
    const auditLink = `${process.env.FRONTEND_URL}/audit/${props.shareToken}`;
    const brevo = getBrevo();

    const senderEmail =
      process.env.BREVO_SENDER_EMAIL ?? "joshibhavya201206@gmail.com";
    const senderName = process.env.BREVO_SENDER_NAME ?? "Credex";

    const htmlContent = `
<div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>AI Spend Audit Completed</h2>

    <p>Your audit has been successfully generated.</p>

    <p>
        Estimated Monthly Savings:
        <strong>$${props.saving}</strong>
    </p>

    ${
      props.isHighSavings
        ? `
        <p>
            Our system detected a high-savings opportunity.
            The Credex team may reach out with additional optimization recommendations.
        </p>
        <p>You can view and share your audit here:</p>`
        : `
        <p>
            Your current AI tooling setup already appears relatively optimized.
        </p>`
    }

    <a href="${auditLink}"
       style="display:inline-block;padding:10px 16px;background:black;
              color:white;text-decoration:none;border-radius:6px;">
      View Audit
    </a>

    <hr style="margin-top:32px;" />
    <p style="font-size:12px;color:gray;">Credex AI Spend Audit</p>
</div>`;

    await brevo.transactionalEmails.sendTransacEmail({
      sender: { email: senderEmail, name: senderName },
      to: [{ email: props.email }],
      subject: "Your AI Spend Audit",
      htmlContent,
    });

    console.log("Confirmation email sent successfully");
  } catch (err) {
    console.error("sendConfirmationEmail error:", err);
  }
}


interface AffectedAudit {
  auditId: string;
  shareToken: string;
  changes: { tool: string; plan: string; oldPrice: number; newPrice: number }[];
}

export interface LeadInfo {
  email: string |null;
  company: string|null;
  audit_id: string|null;
}


export async function sendPricingNotificationEmails(
  affected: AffectedAudit[],
  leads: LeadInfo[],
): Promise<{ emailsSent: number; errors: string[] }> {
  const brevo = getBrevo();
  const senderEmail =
    process.env.BREVO_SENDER_EMAIL ?? "joshibhavya201206@gmail.com";
  const senderName = process.env.BREVO_SENDER_NAME ?? "Credex";

  const byEmail: Record<
    string,
    { email: string; company: string | null; audits: AffectedAudit[] }
  > = {};

  for (const lead of leads) {
    const auditData = affected.find((a) => a.auditId === lead.audit_id);
    if (!auditData) continue;

    if (!byEmail[lead.email!]) {
      byEmail[lead.email!] = { email: lead.email!, company: lead.company, audits: [] };
    }
    byEmail[lead.email!]!.audits.push(auditData);
  }

  // 2. Send one email per user
  let emailsSent = 0;
  const errors: string[] = [];

  for (const { email, company, audits } of Object.values(byEmail)) {
    try {
      const allChangedTools = [
        ...new Set(audits.flatMap((a) => a.changes.map((c) => c.tool))),
      ];

      await brevo.transactionalEmails.sendTransacEmail({
        sender: { email: senderEmail, name: senderName },
        to: [{ email }],
        subject: `Pricing update affects your audit (${allChangedTools.join(", ")})`,
        htmlContent: buildPricingEmail({ email, company, audits }),
      });

      emailsSent++;
      console.log(`Pricing notification sent to ${email}`);
    } catch (err) {

      const msg = `${email}: ${String(err)}`;
      errors.push(msg);
      console.error("sendPricingNotificationEmails error:", msg);
    }
  }

  return { emailsSent, errors };
}



function buildPricingEmail({
  email,
  company,
  audits,
}: {
  email: string;
  company: string | null;
  audits: AffectedAudit[];
}): string {
  const allChangedTools = [
    ...new Set(audits.flatMap((a) => a.changes.map((c) => c.tool))),
  ];

  const auditRows = audits
    .map((a) => {
      const changeRows = a.changes
        .map(
          (c) => `
          <tr>
            <td style="padding:6px 0;color:#555">${c.tool} — ${c.plan}</td>
            <td style="padding:6px 0;text-decoration:line-through;color:#999">$${c.oldPrice}/mo</td>
            <td style="padding:6px 0;font-weight:600;color:#0f6e56">$${c.newPrice}/mo</td>
          </tr>`,
        )
        .join("");

      return `
        <div style="margin-bottom:24px;padding:16px;background:#f9f9f7;border-radius:8px">
          <table style="width:100%;border-collapse:collapse;margin-bottom:12px">
            <thead>
              <tr>
                <th style="text-align:left;font-size:12px;color:#999;padding-bottom:6px">Tool</th>
                <th style="text-align:left;font-size:12px;color:#999;padding-bottom:6px">Was</th>
                <th style="text-align:left;font-size:12px;color:#999;padding-bottom:6px">Now</th>
              </tr>
            </thead>
            <tbody>${changeRows}</tbody>
          </table>
          <a href="${process.env.FRONTEND_URL}/audit/${a.shareToken}/rerun"
             style="display:inline-block;background:#0f6e56;color:#fff;padding:10px 20px;
                    border-radius:6px;text-decoration:none;font-weight:600;font-size:14px">
            Re-run this audit →
          </a>
        </div>`;
    })
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
      <h2 style="font-size:20px;font-weight:600;margin-bottom:8px">
        Pricing changed for tools in your audit
      </h2>
      <p style="color:#555;margin-bottom:24px">
        ${company ? `Hi ${company} team — ` : ""}pricing has updated for
        <strong>${allChangedTools.join(", ")}</strong>.
        Here's what changed and how it affects your recommendations:
      </p>

      ${auditRows}

      <p style="margin-top:8px;color:#555;font-size:14px">
        Re-running shows your original audit side-by-side with the updated one
        so you can see exactly what changed.
      </p>

      <p style="margin-top:32px;font-size:12px;color:#999">
        You're receiving this because you ran an audit on Credlens.
        Powered by <a href="https://credex.rocks" style="color:#999">Credex</a>.
      </p>
    </div>
  `;
}