import { useTimelineStateStore } from '@/hooks/useTimelineStateStore';
import { formatFlexibleDuration } from '@/lib/convertDateinDuration';
import { handleEnum, modeEnum } from '@/types/enum';
import { timelineNodeType } from '@/types/types';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { CalendarDays, MoveRight, Timer } from 'lucide-react';
import Link from 'next/link';

export default function Card({data, selected, id}: NodeProps<timelineNodeType>) {

    const { mode } = useTimelineStateStore();

    const handleType = data.handleType;

    // console.log("in a card: ",data, selected)

    const activeSelectNodeFn = () => {
        if(selected){
            switch (mode) {
                case modeEnum.DELETE:
                    return "border-light-red!"
                case modeEnum.EDIT:
                    return "border-lime-yellow!"
                case modeEnum.SPECTATOR:
                    return "border-light-green!"
                default:
                    break;
            }
        }
    }
    return (
        <>
            {(handleType == handleEnum.START || handleType == handleEnum.MAIN) && <Handle type="source" position={Position.Right} />}
                <div className={`card-style p-5 w-80 ${activeSelectNodeFn()}`}>
                    <div className="flex items-center justify-between">
                        {data.title ? 
                            <h3 className="h-three-style">{data.title}</h3>
                        :
                            <span className='h-4 max-w-40 w-full bg-slate-200 animate-pulse rounded-sm'></span>
                        }
                        {data.type ? 
                            <span className="badge-style bg-light-green">{data.type}</span>
                        :    
                            <span className='h-3 w-10 bg-slate-200 animate-pulse rounded-sm'></span>
                        }
                    </div>
                    <div className="flex gap-x-5 items-center text-purple-dark/50 text-[10px]">
                        <div className="flex items-center justify-between gap-2">
                            <CalendarDays className="w-3 h-3" />
                            {data.start_at && <p>{data.start_at}</p>}
                            {data.end_at && <span>-</span>}
                            {data.end_at && <p>{data.end_at}</p>}
                            {(!data.start_at && !data.end_at) && <span className='h-3 w-18 bg-slate-200 animate-pulse rounded-sm'></span>}
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <Timer className="w-3 h-3" />
                            {(data.start_at && data.end_at) ?
                                <p>{formatFlexibleDuration(data.start_at as string, data.end_at as string)}</p>
                            :    
                                <span className='h-3 w-7 bg-slate-200 animate-pulse rounded-sm'></span>
                            }
                        </div>
                    </div>
                    {data.content ? 
                        <p className="text-xs text-purple-dark/80">{data.content}</p>
                    :
                        <div className='flex flex-col space-y-2'>
                            <span className='h-2 w-full bg-slate-200 animate-pulse rounded-sm'></span>
                            <div className='flex items-center gap-x-2'>
                                <span className='h-2 w-2/5 bg-slate-200 animate-pulse rounded-sm'></span>
                                <span className='h-2 w-3/5 bg-slate-200 animate-pulse rounded-sm'></span>
                            </div>
                            <span className='h-2 w-full bg-slate-200 animate-pulse rounded-sm'></span>
                            <span className='h-2 w-1/2 bg-slate-200 animate-pulse rounded-sm'></span>
                        </div>
                    }
                    <hr className="hr-style"/>
                    <div className="flex items-center justify-between text-purple-dark/50 text-xs m-0">
                        <p>0 Items</p>
                        <Link href={`?menu=timeline&node=${id}`} className="py-1 px-3 bg-light-purple/50 hover:bg-light-purple cursor-pointer rounded-lg">
                            <MoveRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            {(handleType == handleEnum.END || handleType == handleEnum.MAIN) && <Handle type="target" position={Position.Left} />}
        </>
    )
}
