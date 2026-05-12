import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
    },
});

interface PropType {
    email: string;
    saving: number;
    shareToken: string;
    isHighSavings: boolean;
}

export async function sendConfirmationEmail(props: PropType) {
    try {
        const auditLink = `${process.env.FRONTEND_URL}/audit/${props.shareToken}`;

        await transporter.sendMail({
            from: `"Credex" <joshibhavya201206@gmail.com>`,
            to: props.email,
            subject: "Your AI Spend Audit",
            html: `
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
        </p>`: `
        <p>
            Your current AI tooling setup already appears relatively optimized.
        </p>
        `}

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
`,
        });

        console.log("Email sent successfully");
    } catch (err) {
        console.error(err);
    }
}
