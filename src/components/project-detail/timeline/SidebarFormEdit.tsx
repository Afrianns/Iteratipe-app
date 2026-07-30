"use client";

import { Timer } from "lucide-react";
import { formUpdateFn } from "@/lib/forms/updateDataNode";
import { useActionState, useEffect, useState } from "react";
import EditedSavedButton from "./EditedSaveButton";
import { initialStateType, nodeDataType, timelineNodeDataType, timelineNodeType } from "@/types/types";
import { DatePickerRange } from "./DatePickerRange";
import { useTimelineStateStore } from "@/hooks/useTimelineStateStore";
import { formatFlexibleDuration } from "@/lib/convertDateinDuration";
import { ErrorMessageList } from "@/components/ErrorMessageList";
import { ReadonlyURLSearchParams } from "next/navigation";

const initialState: initialStateType = {
  success: false,
  message: {},
};

export default function SidebarFormEdit({params}: {params: ReadonlyURLSearchParams}) {

    const { updateDataNode, getNodeById } = useTimelineStateStore();

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

    const formAction = (data: FormData) => {
        console.log("form data: ", Object.fromEntries(data))

        // const nodeId = params.get("node");

        // if(nodeId != null){
        //     updateDataNode(nodeId, {
        //         title: data.get("title") as string,
        //         type: data.get("type") as string,
        //         start_at: data.get("start_at") as string,
        //         end_at: data.get("end_at") as string,
        //         content: data.get("content") as string
        //     })
        // }
    }

    const updateNodeData = (name: string, value: string) => {
        const nodeId = params.get("node");

        if(nodeId != null) {
            setNodeData({...nodeData, [name]: value})
            if(name == "content") value = limitText(value)
            updateDataNode(nodeId, {...nodeData, [name]: value})
        }
        console.log(name, value)
    }

    return (
        <form action={formAction} className="flex flex-col h-full">
            <section className="space-y-2 px-5 pt-3">
                <div className="flex items-center justify-between gap-x-2">
                    <div className="w-4/6">
                        <label htmlFor="title" className="text-xs font-light">Title</label>
                        <input type="text" className="input-style h-10!" value={nodeData.title} onChange={(e) => updateNodeData("title", e.target.value)} name="title" id="title" />
                    </div>
                    <div className="w-2/6">
                        <label htmlFor="type" className="text-xs font-light">Type</label>
                        <input type="text" className="input-style h-10!" value={nodeData.type} onChange={(e) => updateNodeData("type", e.target.value)} name="type" id="type" />
                    </div>
                </div>
                {/* <ErrorMessageList inputName="title" messages={state.message.title} />
                <ErrorMessageList inputName="type" messages={state.message.type} /> */}
                <div className="flex gap-x-5 items-center text-purple-dark/50 text-[10px] pt-2">
                    <DatePickerRange key={`${nodeData.start_at}-${nodeData.end_at}`} updateNodeData={updateNodeData} initialStartDate={nodeData.start_at as string} initialEndDate={nodeData.end_at as string} durationDateFn={setDurationDate} />
                    <div className="flex items-center justify-between gap-2">
                        <Timer className="w-3 h-3" />
                        <p>{ durationDate || "0 Week" }</p>
                    </div>
                </div>
                {/* <ErrorMessageList inputName="start date" messages={state.message.start_at} />
                <ErrorMessageList inputName="end date" messages={state.message.end_at} /> */}
            </section>

            <div className="px-5 pb-5 pt-2">
                <label htmlFor="content" className="text-xs font-light">Content</label>
                <textarea className="input-style min-h-30" name="content" id="content" value={nodeData.content} onChange={(e) => updateNodeData("content", e.target.value)}></textarea>
                {/* <ErrorMessageList inputName="Content" messages={state.message.content} /> */}
            </div>
            
            <section className="mt-auto h-10 space-y-2 z-10 border-t border-gray-200 bg-whitish px-5 py-2 mb-5 sticky bottom-0">
                <div className="flex items-center justify-between text-purple-dark/50 text-xs m-0">
                    <p>2 Items</p>
                    <EditedSavedButton />
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