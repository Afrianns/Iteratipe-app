"use client";

import { useTimelineStateStore } from '@/hooks/useTimelineStateStore';
import { modeEnum, handleEnum } from '@/types/enum';
import { timelineNodeType } from '@/types/types';
import { useReactFlow } from '@xyflow/react';
import { ChevronDown, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';


export default function CanvasMenu() {

    const [mode, setMode] = useState<modeEnum>(modeEnum.EDIT);
    const [modePosCount, setModePosCount] = useState<number>(0);
    const {changeMode, setFirstNode, setEndNode, setNodes, isEndNodeUsed, isFirstNodeUsed } = useTimelineStateStore();

    const [disableStartNode, setDisableStartNode] = useState<boolean>(false);
    const [disableEndNode, setDisableEndNode] = useState<boolean>(false);

    const { getNode, screenToFlowPosition } = useReactFlow();

    const [isExpand, setIsExpand] = useState(false);

    // it will be change in the future
    let nodeID = 0;

    useEffect(() => {
        setDisableStartNode(isFirstNodeUsed)
        setDisableEndNode(isEndNodeUsed)
    }, [isEndNodeUsed, isFirstNodeUsed])

    const newNode = (handleType: handleEnum) => {

        const reactFlow = document.getElementById("ReactFlow");

        if(handleType == handleEnum.START && getNode("start")) return;
        if(handleType == handleEnum.END && getNode("end")) return;


        if(!reactFlow) return;

        const bounds = reactFlow.getBoundingClientRect();

        const flowPosition = screenToFlowPosition({
            x:  bounds.left + (bounds.width / 2),
            y:  bounds.top + (bounds.height / 2),
        });

        const newNode: timelineNodeType = {
            id: `step-${++nodeID}`,
            position: flowPosition,
            data: { 
                handleType: handleType
            },
            origin: [0.5, 0.5],
            type: 'cardNode',
        }

        setNodes(newNode);

        if(handleType == handleEnum.START) {
            setFirstNode(true);
            setDisableStartNode(true);
        }
        if(handleType == handleEnum.END) {
            setEndNode(true);
            setDisableEndNode(true)
        };

    }

    const menuDropdownFn = () => setIsExpand(!isExpand); 

    const changeModeFn = () => {
        const nextCount = (modePosCount >= 2) ? 0 : modePosCount + 1;
        const modes = [modeEnum.EDIT, modeEnum.DELETE, modeEnum.SPECTATOR]
        
        setModePosCount(nextCount);
        changeMode(modes[nextCount]);
        setMode(modes[nextCount]);

    }

    return (
        <div className='absolute top-5 left-5 card-style w-35 h-fit transition-style'>
            <div className='p-1'>
                <div onClick={menuDropdownFn} className='flex items-center justify-between hover:bg-light-gray rounded-lg cursor-pointer'>
                    <h3 className='p-style font-bold text-md p-2'>Menu</h3>
                    <ChevronDown className='icon-style' />
                </div>
            </div>
            {isExpand &&
                <div className='space-y-2'>
                    <div onClick={changeModeFn} className='cursor-pointer p-1'>
                        {mode == modeEnum.DELETE &&
                            <button className='timeline-btn-style text-light-red font-semibold bg-light-red/20 cursor-pointer hover:bg-light-red/10'>Delete Mode</button>
                        }
                        {mode == modeEnum.EDIT &&
                            <button className='timeline-btn-style text-green-500 font-semibold bg-light-green/20 cursor-pointer hover:bg-light-green/10'>Edit Mode</button>
                        }
                        {mode == modeEnum.SPECTATOR &&
                            <button className='timeline-btn-style text-yellow-500 font-semibold bg-lime-yellow/20 cursor-pointer hover:bg-lime-yellow/10'>Spectator Mode</button>
                        }
                    </div>
                    
                    <hr className="hr-style" />
                    <div className="p-1 space-y-2">
                        <button onClick={() => newNode(handleEnum.START)} className={`timeline-btn-style ${disableStartNode ? 'timeline-btn-accent-disable': 'timeline-btn-accent'}`}>
                            <Plus className="w-4 h-4 stroke-3" />
                            <p className='font-semibold'>Start Node</p>
                        </button>
                        
                        <button onClick={() => newNode(handleEnum.END)} className={`timeline-btn-style ${disableEndNode ? 'timeline-btn-accent-disable': 'timeline-btn-accent'}`}>
                            <Plus className="w-4 h-4 stroke-3" />
                            <p className='font-semibold'>End Node</p>
                        </button>

                        <button onClick={() => newNode(handleEnum.MAIN)} className="timeline-btn-style bg-light-purple/50 hover:bg-light-purple cursor-pointer text-purplish">
                            <Plus className="w-4 h-4 stroke-3" />
                            <p className='font-semibold'>New Node</p>
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}