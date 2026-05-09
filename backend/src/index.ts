import express from "express"
import dotenv from "dotenv"
import { rootRouter } from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;


app.use(express.json());
app.use("/app",rootRouter)




app.listen(PORT,function(){
    console.log(`server started on port : ${PORT}`);
})