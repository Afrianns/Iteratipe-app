"use client";

import { Timer } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { nodeDataType, returnDataType, timelineNodeDataType, timelineNodeType } from "@/types/types";
import { DatePickerRange } from "./DatePickerRange";
import { useTimelineStateStore } from "@/hooks/useTimelineStateStore";
import { formatFlexibleDuration } from "@/lib/convertDateinDuration";
import { ErrorMessageList } from "@/components/ErrorMessageList";
import { ReadonlyURLSearchParams, usePathname, useSearchParams } from "next/navigation";
import { saveTimeline, useCheckModifiedTimeline } from "@/lib/autosave";
import { NodeDataSchema, NodeSchema } from "@/lib/validations";
import z from "zod";
import { toast } from "sonner";
import Upload from "./upload";
import axios from "axios";
import { updateNode } from "@/actions/nodes";
import { FormUpdateType, saveCurrentData, ValidationMessagesType } from "@/actions/upload";
import { handleEnum } from "@/types/enum";
import treeifyErrorHandling from "@/lib/treeifyErrorHandling";
import uploadImage from "@/lib/uploadImage";


const initialData: FormUpdateType = {
    status: 0,
    message: ""
}

const URL = process.env.NEXT_PUBLIC_APP_URL

export default function SidebarFormEdit() {

    const { globalNodes, lastGlobalNodes, updateSingleNodeToLastAndCurrent, updateSingleNode, getNodeById } = useTimelineStateStore();
    const unsaveChanges = useCheckModifiedTimeline()

    const [uploadLoading, setUploadLoading] = useState<boolean>(false)

    const [validationMessages, setValidationMessages] = useState<ValidationMessagesType>({})

    const pathname = usePathname()
    const params = useSearchParams();
    const paths = pathname.split("/")

    const [durationDate, setDurationDate] = useState(formatFlexibleDuration(new Date().toLocaleString(), new Date().toLocaleString()));

    
    const [state, formAction, isPending] = useActionState(saveCurrentData, initialData)

    const [nodeData, setNodeData] = useState<timelineNodeType>({
        id: "",
        position: {
            x: 601.2764748728747,
            y: 204.9859404710946
        },
        data: {
            handleType: handleEnum.MAIN,
            title: "",
            type: "",
            start_at: "",
            end_at: "",
            content: "",
            image_url: ""
        },
        origin: [
            0.5,
            0.5
        ],
        type: "cardNode"
    })

    useEffect(() => {
        console.log("result- ",state, globalNodes, lastGlobalNodes)

        if(state.status == 200 && state.success){
            setValidationMessages({})
            toast.success(state.message)
            updateSingleNodeToLastAndCurrent(state.success)
            
        } 
        
        if(state.status == 500){
            console.log(state)
            toast.error(state.message)
        }
        
        if(state.error) {
            setValidationMessages(state.error)
        }
    }, [state])

    useEffect(() => {
        // it suppose to get the data from db, but for now get from zustand store
        const nodeId = params.get("node");
        if(nodeId != null){
            const node = getNodeById(nodeId);
            if(node != undefined && node.data){
                setNodeData(node)
                setDurationDate(formatFlexibleDuration(node.data.start_at as string, node.data.end_at as string))
            }
        }
    }, [params])

    const updateNodeData = (args: Record<string, string>) => {
        const nodeId = params.get("node");
        if(nodeId != null) {
            let updateData = {...nodeData, data: {...nodeData.data, ...args}};
            console.log('args ',args, updateData)
            setNodeData(updateData)
            updateSingleNode(updateData)
        }
    } 

    const beforeUpdate = async (formData: FormData) => {
        setUploadLoading(true)
        const validation = NodeSchema.safeParse(nodeData)
        if(validation.success){
            storeAndUpdate(formData)
        } else{
            let remapErrorMessages = treeifyErrorHandling(z.treeifyError(validation.error))
            if(remapErrorMessages) {
                setValidationMessages(remapErrorMessages)
            }
            setUploadLoading(false)
        }
    }

    const storeAndUpdate = async (formData: FormData) => {
        try {

            if(nodeData.data.image_url.startsWith(`blob:${URL}`)) {
                const result = await uploadImage(nodeData.data.image_url)
                if(result.status == 200 && result.data){
                    formData.append("image_url", result.data.image_url)
                    formData.append("asset_id", result.data.asset_id)
                } else{
                    throw new Error(result.message);
                }
            } 
            
            if (nodeData.data.image_url.startsWith("https://res.cloudinary.com/cloud-store-images/image")){
                formData.append("image_url", nodeData.data.image_url)
            }

            startTransition(() => {
                formAction(formData);
            });

        } catch (error) {
            if(error instanceof Error){
                toast.error(error.message)
            }
        } finally {
            setUploadLoading(false)
        }
    }


    return (
        <form action={beforeUpdate} className="flex flex-col h-full">
            {/* additional node data */}

            <input type="hidden" name="handle_type" value={nodeData.data.handleType} />
            <input type="hidden" name="project_id" value={paths[2].split("%E2%80%94")[1]} />
            <input type="hidden" name="node_id" value={params.get("node") || ""} />
            <input type="hidden" name="pos_x" value={nodeData.position.x} />
            <input type="hidden" name="pos_y" value={nodeData.position.y} />

            <section className="space-y-2 px-5 pt-3">
                <Upload updateNodeData={updateNodeData} nodeData={nodeData.data} />
            </section>
            <ErrorMessageList inputName="type" messages={validationMessages.image_url} />
            <section className="space-y-2 px-5 pt-3">
                <div className="flex items-center justify-between gap-x-2">
                    <div className="w-4/6">
                        <label htmlFor="title" className="text-xs font-light">Title</label>
                        <input type="text" className="input-style h-10!" value={nodeData.data.title} onChange={(e) => updateNodeData({"title": e.target.value})} name="title" id="title" />
                    </div>
                    <div className="w-2/6">
                        <label htmlFor="type" className="text-xs font-light">Type</label>
                        <input type="text" className="input-style h-10!" value={nodeData.data.type} onChange={(e) => updateNodeData({"type": e.target.value})} name="type" id="type" />
                    </div>
                </div>
                <ErrorMessageList inputName="title" messages={validationMessages.title} />
                <ErrorMessageList inputName="type" messages={validationMessages.type} />
                <div className="flex gap-x-5 items-center text-main-text/50 text-[10px] pt-2">
                    <DatePickerRange key={`${nodeData.data.start_at}-${nodeData.data.end_at}`} updateNodeData={updateNodeData} initialStartDate={nodeData.data.start_at as string} initialEndDate={nodeData.data.end_at as string} durationDateFn={setDurationDate} />
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
                <textarea className="input-style min-h-30" name="content" id="content" value={nodeData.data.content} onChange={(e) => updateNodeData({"content": e.target.value})}></textarea>
                <ErrorMessageList inputName="Content" messages={validationMessages.content} />
            </div>
            
            <section className="mt-auto h-10 space-y-2 z-10 border-t border-gray-200 bg-whitish px-5 py-2 mb-5 sticky bottom-0">
                <div className="flex items-center justify-between text-main-text/50 text-xs m-0">
                    <p>2 Items</p>
                    {unsaveChanges ? 
                        <button type="button" className="py-2 px-5 'bg-secondary/20 cursor-not-allowed rounded-lg text-main">
                            No changes
                        </button>
                    :
                        <>
                            {(isPending || uploadLoading) ? 
                                <button type="button" className="py-2 px-5 'bg-secondary/20 cursor-not-allowed rounded-lg text-main">
                                    Loading...
                                </button>
                                : 
                                <button type="submit" className="py-2 px-5 bg-secondary/50 hover:bg-secondary cursor-pointer rounded-lg text-main">
                                    Save
                                </button>
                            }
                        </>
                    }
                </div>
            </section>
        </form>
    )
}

function limitText(text: string, maxLength = 100) {
  if (!text) return "";

  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + "...";
}

// {
//     "id": "b8f4c5b2-c97d-480c-94d1-0927f8e5ec65",
//     "position": {
//         "x": 601.2764748728747,
//         "y": 204.9859404710946
//     },
//     "data": {
//         "handleType": "end",
//         "title": "",
//         "type": "",
//         "start_at": "",
//         "end_at": "",
//         "content": "",
//         "image_url": ""
//     },
//     "origin": [
//         0.5,
//         0.5
//     ],
//     "type": "cardNode"
// }

// if(file){
//     const fileData  = new FormData()
    
//     fileData.append("file", file)
//     const response = await axios.post("/api/image", fileData)

//     console.log("check response ",response)
//     if(response.status == 200){
//         console.log(response.data)
//         formData.append("image_url", response.data.image_url)
//         formData.append("asset_id", response.data.asset_id)
//     } else{
//         throw new Error(response.statusText);
//     }
// } else{
//     console.log(nodeData, nodeData.data.image_url)
//     formData.append("image_url", nodeData.data.image_url)
// }