import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { AddLead } from "../components/AddLead";

interface ResponseType {
    id: string;
    share_token: string | null;
    team_size: number;
    use_case: string;
    tools: string;
    recommendations: string;
    redundancies: string;
    total_monthly_saving: number;
    total_annual_saving: number;
    is_already_optimal: boolean | null;
    summary: string | null;
    created_at: string | null;
    needs_admin_controls: boolean | null;
}


export default function ViewAudit() {
    const { token } = useParams();
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const [data, setData] = useState<ResponseType | null>(null);
    const [loading, setLoading] = useState(true);
    const [visibility,setVisibility] = useState(false);

    const isNew = searchParams.get("new") === "true";
    



    useEffect(() => {
        (async () => {
            

            console.log("isNew:", isNew);

            try {
                let response;

                if (isNew) {
                    response = await axios.get<ResponseType>(
                        `${import.meta.env.VITE_BACKEND_URL}/app/audit/${token}`
                    );
                } else {
                    response = await axios.get<ResponseType>(
                        `${import.meta.env.VITE_BACKEND_URL}/app/audit/${token}/public`
                    );
                }

                setData(response.data);
            } catch (err) {
                console.error(err);

                setData(null);

                alert("Some error occurred fetching the data from the backend");

                navigate("/audit/create");
            } finally {
                setLoading(false);
            }
        })();
    }, [token, searchParams, navigate]);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!data) {
        return <div>No audit data found.</div>;
    }

    return (
        <div className="p-6">
            <div className="text-2xl font-bold mb-4">
                Welcome to View Audit Page
            </div>

            <div className="flex flex-col gap-2 border p-4 rounded-md">

                <div>
                    <strong>Created At:</strong>{" "}
                    {data.created_at
                        ? new Date(data.created_at).toLocaleString()
                        : "N/A"}
                </div>

                <div>
                    <strong>Team Size:</strong> {data.team_size}
                </div>

                <div>
                    <strong>Use Case:</strong> {data.use_case}
                </div>

                <div>
                    <strong>Already Optimal:</strong>{" "}
                    {data.is_already_optimal ? "Yes" : "No"}
                </div>

                <div>
                    <strong>Recommendations:</strong>
                    <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                        {data.recommendations}
                    </pre>
                </div>

                <div>
                    <strong>Redundancies:</strong>
                    <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                        {data.redundancies}
                    </pre>
                </div>


                <div>
                    <strong>Total Monthly Saving:</strong> $
                    {data.total_monthly_saving}
                </div>

                <div>
                    <strong>Total Annual Saving:</strong> $
                    {data.total_annual_saving}
                </div>

                <div>
                    <strong>Summary:</strong>{" "}
                    {data.summary || "No summary available"}
                </div> 
                
            </div>
            {isNew && <div className="flex justify-center">
                <button onClick={()=>{
                    setVisibility(true)
                }}>Enter Details to Receive the audit in your mail!</button>

            </div>}

            {visibility &&(
                <AddLead setVisibility={setVisibility} auditId={data.id}/>
            )}
        </div>
    );
}