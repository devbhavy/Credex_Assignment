import {OpenRouter} from "@openrouter/sdk"
import dotenv from "dotenv"
dotenv.config();

const client = new OpenRouter({
    apiKey : `${process.env.OPENROUTER_API_KEY}`

})

// async function main(){
//     const completion = await client.chat.send({
//         chatRequest : {
//             // model: 'tencent/hy3-preview:free',
//             model : "openai/gpt-oss-120b:free",
//             messages: [
//             {
//                 role: 'user',
//                 content: 'difference between reflection and refraction answer briefly',
//             },
//             ]
//         }
//     });

//     console.log(completion.choices[0]?.message.content)
// }

// main()


export {client}


