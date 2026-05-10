import { Resend } from 'resend';
import dotenv from "dotenv";
dotenv.config();

const RESEND_KEY = process.env.RESEND_API_KEY;
const resend = new Resend(RESEND_KEY);


interface PropType{
    email : string,
    saving: number,
    shareToken: string,
    isHighSavings:boolean
}



export async function sendConfirmationEmail(props : PropType){
    try{
        if(props.isHighSavings){
            await resend.emails.send({
                from : 'devbhavy <onboarding@resend.dev>',
                to : [props.email],
                subject : "hello world!!",
                html : `<strong>It works! the lead was for a high savings audit :$${props.saving}</strong>`,
            });

        }else{
            await resend.emails.send({
                from : 'devbhavy <onboarding@resend.dev>',
                to : [props.email],
                subject : "hello world!!",
                html : `<strong>It works! the lead was for a normal savings audit:$${props.saving}</strong>`,
            });
        }
        

    }catch(err){
        return console.error({err});

    }
    


}