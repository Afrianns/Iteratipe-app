import { useTimelineStateStore } from '@/hooks/useTimelineStateStore';
import { formatFlexibleDuration } from '@/lib/convertDateinDuration';
import { handleEnum, modeEnum } from '@/types/enum';
import { timelineNodeType } from '@/types/types';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { CalendarDays, Info, MoveRight, Timer } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

export default  memo(function Card({data, selected, id}: NodeProps<timelineNodeType>) {

    const mode = useTimelineStateStore((state) => state.mode);

    const handleType = data.handleType;

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
                {(!data.content || !data.title || !data.type || !data.start_at || !data.end_at) && 
                    <div title="completed all field to make it public" className='h-5 group card-style-secondary py-1! px-2! mb-3 w-fit! flex items-center gap-x-2'>
                        <Info  className='w-3 h-3 stroke-amber-600' />
                        <p className='span-style group-hover:block hidden'>Node currently is private</p>
                    </div>
                }
                <div className={`card-style shadow-none! overflow-hidden w-80 ${activeSelectNodeFn()}`}>
                    {data.image_url &&
                        <div className='w-full h-30 relative mbe-0!'>
                            <Image alt="thumbnail" src={data.image_url} fill className='object-cover'/>
                        </div>
                    }
                    <div className='p-3 space-y-3 mbe-0!'>
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
                        <div className="flex gap-x-5 items-center text-main-text/50 text-[10px]">
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
                            <p className="span-style text-main-text/50">{data.content}</p>
                        :
                            <div className='flex flex-col space-y-2'>
                                <div className='flex items-center gap-x-2'>
                                    <span className='h-2 w-2/5 bg-slate-200 animate-pulse rounded-sm'></span>
                                    <span className='h-2 w-3/5 bg-slate-200 animate-pulse rounded-sm'></span>
                                </div>
                                <div className='flex items-center gap-x-2'>
                                    <span className='h-2 w-5/8 bg-slate-200 animate-pulse rounded-sm'></span>
                                    <span className='h-2 w-3/8 bg-slate-200 animate-pulse rounded-sm'></span>
                                </div>
                                <span className='h-2 w-1/2 bg-slate-200 animate-pulse rounded-sm'></span>
                            </div>
                        }
                    </div>
                    <hr className="hr-style"/>
                    <div className="p-3 pt-0 flex items-center justify-between text-main-text/50 text-xs m-0">
                        <p>0 Items</p>
                        <Link href={`?menu=timeline&node=${id}`} className="py-1 px-3 bg-secondary/50 hover:bg-secondary cursor-pointer rounded-lg">
                            <MoveRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            {(handleType == handleEnum.END || handleType == handleEnum.MAIN) && <Handle type="target" position={Position.Left} />}
        </>
    )
})
