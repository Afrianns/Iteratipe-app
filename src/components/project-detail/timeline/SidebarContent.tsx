
import { useTimelineStateStore } from "@/hooks/useTimelineStateStore";
import { formatFlexibleDuration } from "@/lib/convertDateinDuration";
import { handleEnum } from "@/types/enum";
import { timelineNodeDataType } from "@/types/types";
import { CalendarDays, Timer } from "lucide-react";
import { ReadonlyURLSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SidebarContent({params}: {params: string | undefined}) {
    
    const getNodeById = useTimelineStateStore((state) => state.getNodeById);

    let nodeData: timelineNodeDataType = {
        title: "",
        content: "",
        end_at: "",
        handleType: handleEnum.START,
        start_at: "",
        type: ""
    }

    if(params){
        const result = getNodeById(params);
        if(result) nodeData = result.data
    }

    return (
        <>
            <section className="space-y-2 px-5 pt-3">
                <div className="flex items-center justify-between">
                    <h3 className="h-three-style">{nodeData.title}</h3>
                    <span className="badge-style bg-light-green">{nodeData.type}</span>
                </div>
                <div className="flex gap-x-5 items-center text-main-text/50 text-[10px]">
                    <div className="flex items-center justify-between gap-2">
                        <CalendarDays className="w-3 h-3" />
                        <div className="flex items-center gap-x-2">
                            <p>{nodeData.start_at}</p>
                            -
                            <p>{nodeData.end_at}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <Timer className="w-3 h-3" />
                        <p>{formatFlexibleDuration(nodeData.start_at, nodeData.end_at)}</p>
                    </div>
                </div>
            </section>

            <p className="text-xs text-main-text/80 my-2 px-5">{nodeData.content}</p>
            
            <section className="mt-auto h-10 space-y-2 z-10 border-t border-gray-200 bg-whitish px-5 py-2 mb-5 sticky bottom-0">
                <div className="flex items-center justify-between text-main-text/50 text-xs m-0">
                    <p>2 Items</p>
                    <span className="py-2 px-5">Comments</span>
                </div>
            </section>
        </>
    )
}