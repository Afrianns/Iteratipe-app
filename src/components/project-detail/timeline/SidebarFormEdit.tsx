"use client";

import { Timer } from "lucide-react";
import { formUpdateFn } from "@/lib/forms/updateDataNode";
import { useActionState, useState } from "react";
import EditedSavedButton from "./EditedSaveButton";
import { initialStateType } from "@/types/types";
import { DatePickerRange } from "./DatePickerRange";
import { useTimelineStateStore } from "@/hooks/useTimelineStateStore";
import { formatFlexibleDuration } from "@/lib/convertDateinDuration";

const initialState: initialStateType = {
  success: false,
  message: {},
};

export default function SidebarFormEdit() {

    const { nodeDataEdit } = useTimelineStateStore();

    const [durationDate, setDurationDate] = useState(formatFlexibleDuration(nodeDataEdit.startDate, nodeDataEdit.endDate));
    
    const [state, formAction] = useActionState(formUpdateFn, initialState)

    return (
        <form action={formAction} className="flex flex-col h-full">
            <section className="space-y-2 px-5 pt-3">
                <div className="flex items-center justify-between gap-x-2">
                    <div className="w-4/6">
                        <label htmlFor="title" className="text-xs font-light">Title</label>
                        <input type="text" className="input-style h-10!" defaultValue={nodeDataEdit.title} name="title" id="title" />
                    </div>
                    <div className="w-2/6">
                        <label htmlFor="type" className="text-xs font-light">Type</label>
                        <input type="text" className="input-style h-10!" defaultValue={nodeDataEdit.type} name="type" id="type" />
                    </div>
                </div>
                <ErrorMessageList inputName="title" messages={state.message.title} />
                <ErrorMessageList inputName="type" messages={state.message.type} />
                <div className="flex gap-x-5 items-center text-purple-dark/50 text-[10px] pt-2">
                    <DatePickerRange initialStartDate={nodeDataEdit.startDate} initialEndDate={nodeDataEdit.endDate} durationDateFn={setDurationDate} />
                    <div className="flex items-center justify-between gap-2">
                        <Timer className="w-3 h-3" />
                        <p>{ durationDate || "0 Week" }</p>
                    </div>
                </div>
                <ErrorMessageList inputName="start date" messages={state.message.start_at} />
                <ErrorMessageList inputName="end date" messages={state.message.end_at} />
            </section>

            <div className="px-5 pb-5 pt-2">
                <label htmlFor="content" className="text-xs font-light">Content</label>
                <textarea className="input-style min-h-30" name="content" id="content" defaultValue={nodeDataEdit.content}></textarea>
                <ErrorMessageList inputName="Content" messages={state.message.content} />
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

const ErrorMessageList = ({ inputName, messages }: {inputName: string, messages: string[] | undefined}) => {
    return (
        <>
            {messages &&
                <div className="bg-light-red/20 py-1 text-xs rounded px-2">
                    <p className="text-light-red font-bold capitalize">{inputName}</p>
                    <ul>
                        {messages?.map((msg,idx) =><li key={idx} className="list-disc list-inside error-msg-style">{msg}</li>)}
                    </ul>
                </div> 
            }
        </>
    )
}