
import { useTimelineStateStore } from "@/hooks/useTimelineStateStore";
import { formatFlexibleDuration } from "@/lib/convertDateinDuration";
import { handleEnum } from "@/types/enum";
import { timelineNodeDataType } from "@/types/types";
import { CalendarDays, Timer } from "lucide-react";
import { useEffect, useState } from "react";

export default function SidebarContent({params}: {params: string | undefined}) {
    
    const getNodeById = useTimelineStateStore((state) => state.getNodeById);
    const globalNodes = useTimelineStateStore((state) => state.globalNodes);

    const [nodeData, setNodeData] = useState<timelineNodeDataType>({
        title: "",
        image_url: "",
        content: "",
        end_at: "",
        handleType: handleEnum.START,
        start_at: "",
        type: ""
    })

    useEffect(() => {

        if(params){
            const result = getNodeById(params);
            if(result) setNodeData(result.data)
        }
        
    }, [globalNodes])
    return (
        <>
            <section className="space-y-5 px-5 pt-3">
                <div className="flex items-center justify-between">
                    {nodeData.title ?
                        <h3 className="h-two-style">{nodeData.title}</h3>
                        :
                        <div className='h-5 w-60 bg-slate-200 animate-pulse rounded-sm'></div>
                    }
                    {nodeData.type ?
                        <p className="badge-style bg-light-green">{nodeData.type}</p>
                        :
                        <div className='h-4 w-15 bg-slate-200 animate-pulse rounded-sm'></div>
                    }
                </div>
                <div className="flex gap-x-5 items-center text-main-text/50 text-[10px] mb-7">
                    {nodeData.start_at && nodeData.end_at ?
                        <>
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
                        </>
                    : 
                        <div className="flex w-70 gap-x-3">
                            <div className='h-4 w-4/6 bg-slate-200 animate-pulse rounded-sm'></div>
                            <div className='h-4 w-2/6 bg-slate-200 animate-pulse rounded-sm'></div>
                        </div>
                    }
                </div>
                {nodeData.content ?
                    <p className="text-xs text-main-text/80">{nodeData.content}</p>
                :
                    <div className='flex flex-col space-y-3'>
                        <div className='flex items-center gap-x-2'>
                            <span className='h-3 w-2/5 bg-slate-200 animate-pulse rounded-sm'></span>
                            <span className='h-3 w-3/5 bg-slate-200 animate-pulse rounded-sm'></span>
                        </div>
                        <div className='flex items-center gap-x-2'>
                            <span className='h-3 w-5/8 bg-slate-200 animate-pulse rounded-sm'></span>
                            <span className='h-3 w-3/8 bg-slate-200 animate-pulse rounded-sm'></span>
                        </div>
                        <span className='h-3 w-full bg-slate-200 animate-pulse rounded-sm'></span>
                        <div className='flex items-center gap-x-2'>
                            <span className='h-3 w-5/8 bg-slate-200 animate-pulse rounded-sm'></span>
                            <span className='h-3 w-3/8 bg-slate-200 animate-pulse rounded-sm'></span>
                        </div>
                        <span className='h-3 w-1/2 bg-slate-200 animate-pulse rounded-sm'></span>
                    </div>
                }
            </section>
            
            <section className="mt-auto h-10 space-y-2 z-10 border-t border-gray-200 bg-whitish px-5 py-2 mb-5 sticky bottom-0">
                <div className="flex items-center justify-between text-main-text/50 text-xs m-0">
                    <p>2 Items</p>
                    <span className="py-2 px-5">Comments</span>
                </div>
            </section>
        </>
    )
}