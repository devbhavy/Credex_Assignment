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

    <p>
        Your audit has been successfully generated.
    </p>

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
    
        <p>
            You can view and share your audit here:
        </p>`
            : `
        <p>
            Your current AI tooling setup already appears relatively optimized.
        </p>
        `
    }

        <a
            href="${auditLink}"
            style="
                display:inline-block;
                padding:10px 16px;
                background:black;
                color:white;
                text-decoration:none;
                border-radius:6px;
            "
        >
            View Audit
        </a>
        
            
    

    <hr style="margin-top:32px;" />

    <p style="font-size: 12px; color: gray;">
        Credex AI Spend Audit
    </p>
</div>
`;

        await brevo.transactionalEmails.sendTransacEmail({
            sender: { email: senderEmail, name: senderName },
            to: [{ email: props.email }],
            subject: "Your AI Spend Audit",
            htmlContent,
        });

        console.log("Email sent successfully");
    } catch (err) {
        console.error(err);
    }
}
