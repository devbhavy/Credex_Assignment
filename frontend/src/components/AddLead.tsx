import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

interface leadInput{
    auditId: any;
    email: any;
    company: any;
    role: any;
    
}

export function AddLead({setVisibility,auditId} : {setVisibility : any,auditId:string}){
    const [leadData,setLeadData] = useState<leadInput>({
        auditId:auditId,
        email:"",
        company:"",
        role:""

    });
    const navigate = useNavigate();

    function handleInput(e){
        const name = e.target.name;
        const value = e.target.value;

        setLeadData((prev)=>{
            return {...prev,[name]:value}
        })
    }
    async function handleSubmit(e){
        e.preventDefault()
        try{
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/app/lead/capture`,leadData);
            alert("Email sentSuccessfully!!");
            navigate(`/audit/${response.data.shareToken}`,{replace : true});
            setVisibility(false)

        }catch(err){
            alert("Some error occurred!!");
            
        }
    }


    return(
        <div className="flex flex-row items-center justify-center bg-white absolute left-0 right-0 top-0 bottom-0">
            <div className="bg-amber-200 flex flex-col p-5 rounded-2xl">
                <div className="flex flex-row justify-between">
                    <div>
                    Enter details :
                    </div>
                    <div className="bg-red-400">
                        <button onClick={()=>setVisibility(false)}>Close</button>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input type="email"  placeholder="Enter your email" name="email" onChange={handleInput} required/>
                    </div>
                    
                    <div>
                        <input type="text" onChange={handleInput} name="company"  placeholder="Enter company/Institution name"/>
                    </div>
                    
                    <div>
                        <input type="text" onChange={handleInput} name="role" placeholder="Enter your role in the company"/>
                    </div>
                    <div>
                        <button type="submit">Click to submit your details</button>
                    </div>


                </form>
            </div>
        </div>
    )
}