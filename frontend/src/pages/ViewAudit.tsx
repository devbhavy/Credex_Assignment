import { useEffect } from "react";
import { useParams } from "react-router"

export default function ViewAudit(){
    const params = useParams();

    useEffect(()=>{
        console.log(params)
    },[])

    return(
        <div>
            welcome to view audit page {params.token}
        </div>
    )
}