import type { toolType } from "../../pages/CreateAudit";

export function ToolCard(props:toolType){
    return(
        <div className="p-5 bg-amber-200 border-2 inline-block rounded-2xl">
            <div>monthlySpend : {props.tool}</div>
            <div>plan : {props.plan}</div>
            <div>seats : {props.seats}</div>
            <div>monthlySpend : {props.monthlySpend}</div>
            <div>usageFrequency : {props.usageFrequency}</div>

        </div>
    )
}