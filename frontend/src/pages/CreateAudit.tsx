import { useState } from "react"
import { ToolCard } from "../components/card/ToolCard";
import { AddTool } from "../components/AddTool";
import axios from "axios";
import { useNavigate } from "react-router";

export interface toolType {
  tool: string;
  plan: string;
  seats: number;
  monthlySpend: number;
  usageFrequency: string;
}

type UseCase = "coding" | "writing" | "research" | "data" | "mixed";

interface additionalInfoType{
  teamSize:number;
  useCase : UseCase,
  needsAdminControls : boolean
}



export default function CreateAudit() {
  const [input, setInput] = useState<toolType[]>([]);
  const [additionalInfo,setAdditonalInfo] = useState<additionalInfoType>({
    teamSize : 0,
    useCase : 'coding',
    needsAdminControls : false
  })
  const [visibility, setVisibility] = useState(false);
  const navigate = useNavigate()

  const onAdd = (entry: toolType) => {
    setInput((prev) => [...prev, entry]);
  };

  async function handleSubmit(e){
    e.preventDefault();
    const auditInput ={...additionalInfo,tools:input}
    console.log(auditInput);
    try{
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/app/audit/create`,auditInput);
      navigate(`/audit/${response.data.auditId}?new=true`,{
        replace : true
      })

      
      
    }catch(err){
      alert("failed to generate audit some error occurred!")

    }


  }


  function handleAdditionalInfoChange(e: any) {
    const { name, value } = e.target;
    
    let parsed: string | number | boolean = value;
    if (name === "teamSize") parsed = Number(value);
    if (name === "needsAdminControls") parsed = value === "true";
  
    setAdditonalInfo({
      ...additionalInfo,
      [name]: parsed
    });
  }

  return (
    <div>
      <div>welcome to create audit page!!!! hello</div>

      <div>
        <button onClick={() => setVisibility(true)}>
          Click to add a new Tool
        </button>
      </div>

      {visibility && (
        <AddTool setVisibility={setVisibility} onAdd={onAdd} />
      )}

      <div className="border-2 min-h-10 min-w-2xl w-2xl p-3 gap-y-3 flex flex-col">
        {input.length === 0
          ? <div>Your tools are displayed here</div>
          : input.map((data, index) => (
              <div key={index}>
                <ToolCard {...data} />
              </div>
            ))
        }
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <div>UseCase:</div>
          <label>
            <input type="radio" name="useCase" onChange={handleAdditionalInfoChange} value="coding"></input>
            coding
          </label>
          <label>
            <input type="radio" name="useCase" onChange={handleAdditionalInfoChange} value="writing"></input>
            writing
          </label>
          <label>
            <input type="radio" name="useCase" onChange={handleAdditionalInfoChange} value="research"></input>
            reasearch
          </label>
          <label>
            <input type="radio" name="useCase" onChange={handleAdditionalInfoChange} value="data"></input>
            data
          </label>
          <label>
            <input type="radio" name="useCase" onChange={handleAdditionalInfoChange} value="mixed"></input>
            mixed
          </label>
        </div>
        <div>
          <div>needs admin controls?</div>
          <label>
            <input type="radio" name="needsAdminControls" onChange={handleAdditionalInfoChange} value="true"></input>
            yes
          </label>
          <label>
            <input type="radio" name="needsAdminControls" onChange={handleAdditionalInfoChange} value="false"></input>
            no
          </label>

        </div>
        <div>
          <div>team size</div>
          <input type="number" name="teamSize" min={1} max={100} onChange={handleAdditionalInfoChange} value={additionalInfo.teamSize}></input>

        </div>
        <div>
          <button type="submit">Submit</button>
        </div>



      </form>
      
    </div>
  );
}