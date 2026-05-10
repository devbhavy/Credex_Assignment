import { useEffect, useState } from "react"
import { ToolCard } from "../components/card/ToolCard";
import { AddTool } from "../components/card/AddTool";

export interface toolType {
  tool: string;
  plan: string;
  seats: number;
  monthlySpend: number;
  usageFrequency: string;
}

export default function CreateAudit() {
  const [input, setInput] = useState<toolType[]>([]);
  const [visibility, setVisibility] = useState(false);

  const onAdd = (entry: toolType) => {
    setInput((prev) => [...prev, entry]);
  };

  useEffect(()=>{
    console.log(input)
  },[input])

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

      <div className="border-2 min-h-10 min-w-2xl inline-block">
        {input.length === 0
          ? <div>Your tools are displayed here</div>
          : input.map((data, index) => (
              <div key={index}>
                <ToolCard key={index} />
              </div>
            ))
        }
      </div>
    </div>
  );
}