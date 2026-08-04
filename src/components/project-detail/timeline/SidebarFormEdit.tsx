"use client";

import { Timer } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { initialStateType, nodeDataType, timelineNodeDataType, timelineNodeType } from "@/types/types";
import { DatePickerRange } from "./DatePickerRange";
import { useTimelineStateStore } from "@/hooks/useTimelineStateStore";
import { formatFlexibleDuration } from "@/lib/convertDateinDuration";
import { ErrorMessageList } from "@/components/ErrorMessageList";
import { ReadonlyURLSearchParams, usePathname } from "next/navigation";
import { saveTimeline, useCheckModifiedTimeline } from "@/lib/autosave";
import { NodeDataSchema, NodeListSchema, NodeSchema } from "@/lib/validations";
import z from "zod";
import { toast } from "sonner";


interface ValidationMessagesType {
    title?: string[]
    type?: string[]
    start_at?: string[]
    end_at?: string[]
    content?: string[]
}

export default function SidebarFormEdit({params}: {params: ReadonlyURLSearchParams}) {

    const { globalNodes, globalEdges,  setGlobalNodes, setGlobalEdges, setLastGlobalEdges, setLastGlobalNodes, updateDataNode, getNodeById } = useTimelineStateStore();
    const unsaveChanges = useCheckModifiedTimeline()

    const [validationMessages, setValidationMessages] = useState<ValidationMessagesType>({})
    
    const pathname = usePathname()
    const paths = pathname.split("/")

    const [durationDate, setDurationDate] = useState(formatFlexibleDuration(new Date().toLocaleString(), new Date().toLocaleString()));

    const [nodeData, setNodeData] = useState<nodeDataType>({
        title: "",
        type: "",
        content: "",
        start_at: "",
        end_at: ""
    })

    useEffect(() => {
        // it suppose to get the data from db, but for now get from zustand store
        const nodeId = params.get("node");
        if(nodeId != null){
            const node = getNodeById(nodeId);
            if(node != undefined && node.data){
                setNodeData(node.data)
                setDurationDate(formatFlexibleDuration(node.data.start_at as string, node.data.end_at as string))
            }
        }
    }, [params])

    const updateNodeData = (args: Record<string, string>) => {
        const nodeId = params.get("node");
        if(nodeId != null) {
            let updateDate = {...nodeData, ...args};
            setNodeData(updateDate)
            updateDataNode(nodeId, updateDate)
        }
    } 

    const saveCurrentData = async () => {    
        const paths = pathname.split('/');

        const validation = NodeDataSchema.safeParse(nodeData)

        if(validation.success){
            console.log(validation)
            const result = await saveTimeline({paths, globalEdges, globalNodes, setGlobalEdges, setGlobalNodes})
        
            if(result.data?.result_nodes.status == 200 || result.data?.result_nodes.node) setLastGlobalNodes(result.data.result_nodes.node)
            if(result.data?.result_edges.status == 200 || result.data?.result_edges.edges) setLastGlobalEdges(result.data.result_edges.edges)

        } else{
            setValidationMessages(z.flattenError(validation.error).fieldErrors);
        }

        
    };

    return (
        <form className="flex flex-col h-full">
            <section className="space-y-2 px-5 pt-3">
                <div className="flex items-center justify-between gap-x-2">
                    <div className="w-4/6">
                        <label htmlFor="title" className="text-xs font-light">Title</label>
                        <input type="text" className="input-style h-10!" value={nodeData.title} onChange={(e) => updateNodeData({"title": e.target.value})} name="title" id="title" />
                    </div>
                    <div className="w-2/6">
                        <label htmlFor="type" className="text-xs font-light">Type</label>
                        <input type="text" className="input-style h-10!" value={nodeData.type} onChange={(e) => updateNodeData({"type": e.target.value})} name="type" id="type" />
                    </div>
                </div>
                <ErrorMessageList inputName="title" messages={validationMessages.title} />
                <ErrorMessageList inputName="type" messages={validationMessages.type} />
                <div className="flex gap-x-5 items-center text-purple-dark/50 text-[10px] pt-2">
                    <DatePickerRange key={`${nodeData.start_at}-${nodeData.end_at}`} updateNodeData={updateNodeData} initialStartDate={nodeData.start_at as string} initialEndDate={nodeData.end_at as string} durationDateFn={setDurationDate} />
                    <div className="flex items-center justify-between gap-2">
                        <Timer className="w-3 h-3" />
                        <p>{ durationDate || "0 Week" }</p>
                    </div>
                </div>
                <ErrorMessageList inputName="start date" messages={validationMessages.start_at} />
                <ErrorMessageList inputName="end date" messages={validationMessages.end_at} />
            </section>

            <div className="px-5 pb-5 pt-2">
                <label htmlFor="content" className="text-xs font-light">Content</label>
                <textarea className="input-style min-h-30" name="content" id="content" value={nodeData.content} onChange={(e) => updateNodeData({"content": e.target.value})}></textarea>
                <ErrorMessageList inputName="Content" messages={validationMessages.content} />
            </div>
            
            <section className="mt-auto h-10 space-y-2 z-10 border-t border-gray-200 bg-whitish px-5 py-2 mb-5 sticky bottom-0">
                <div className="flex items-center justify-between text-purple-dark/50 text-xs m-0">
                    <p>2 Items</p>
                    {unsaveChanges ? 
                        <button type="button" onClick={saveCurrentData} className="py-2 px-5 bg-light-purple/50 hover:bg-light-purple cursor-pointer rounded-lg text-purplish">
                            Save
                        </button>
                    :
                        <button type="button" className="py-2 px-5 'bg-light-purple/20 cursor-not-allowed rounded-lg text-purplish">
                            No changes
                        </button>
                    }
                </div>
            </section>
        </form>
    )
}

function limitText(text: string, maxLength = 100) {
  if (!text) return "";
  
  // If the text is already short enough, return it as is
  if (text.length <= maxLength) return text;
  
  // Cut the text and append the ellipses
  return text.slice(0, maxLength) + "...";
}