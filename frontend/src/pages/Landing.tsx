import { useNavigate } from "react-router"

export default function Landing(){
    const navigate = useNavigate();
    return(
        <div>
            <div>
                welcome to the landing page!!
            </div>
            <div>
                <button onClick={()=>navigate("/audit/create",{replace:true})} className="bg-amber-100 px-3.5 py-1.5 border-2 rounded-full">create audit</button>
            </div>

        </div>
        
    )
}