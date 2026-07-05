import { Node, useReactFlow } from '@xyflow/react';
import { ChevronDown, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

enum handleEnum {
    START = "start",
    MAIN = "main",
    END = "end"
}

export default function TimelineMenu() {

    const [disableStartNode, setDisableStartNode] = useState<boolean>(false);
    const [disableEndNode, setDisableEndNode] = useState<boolean>(false);

    const {addNodes, getNode } = useReactFlow();

    const [isExpand, setIsExpand] = useState(false);

    let nodeID = 0;

    const newNode = (handleType: handleEnum) => {

        let id = (handleType != handleEnum.MAIN) ? handleType : `step-${++nodeID}`;

        const prevNodePos = getNode("initial-node");
        let newPosNode = prevNodePos?.position.x ? prevNodePos.position.x - 50 : -50
        const newNode: Node = {
            id: id,
            position: { x: newPosNode ?? 0, y: prevNodePos?.position?.y ?? 0 },
            data: { 
                label: 'Node-step', 
                handleType: handleType
             },
            type: 'cardNode',
        }

        addNodes(newNode);
        console.log("Created Node", getNode("initial-node")?.position);
    }

    useEffect(() => {
        checkFn();
    },[newNode])

    const menuDropdownFn = () => {
        setIsExpand(!isExpand);
    }

    const checkFn = () => {
        const startNode = getNode("start");
        const endNode = getNode("end");

        if(startNode != undefined){
            setDisableStartNode(true);
        }

        if(endNode != undefined){
            setDisableEndNode(true);
        }
    }
    return (
        <div className='absolute top-5 left-5 card-style p-2 w-50 h-fit transition-style'>
            <div onClick={menuDropdownFn} className='flex items-center justify-between hover:bg-light-gray rounded cursor-pointer'>
                <h3 className='p-style font-bold text-md pl-1'>Menu</h3>
                <ChevronDown className='icon-style' />
            </div>
            {isExpand &&
                <div className='space-y-3'>
                    <button onClick={() => newNode(handleEnum.START)} className={`timeline-btn-style ${disableStartNode ? 'timeline-btn-accent-disable': 'timeline-btn-accent'}`}>
                        <Plus className="w-4 h-4 stroke-3" />
                        <p className='font-bold'>Start Node</p>
                    </button>
                    
                    <button onClick={() => newNode(handleEnum.END)} className={`timeline-btn-style ${disableEndNode ? 'timeline-btn-accent-disable': 'timeline-btn-accent'}`}>
                        <Plus className="w-4 h-4 stroke-3" />
                        <p className='font-bold'>End Node</p>
                    </button>

                    <button onClick={() => newNode(handleEnum.MAIN)} className="timeline-btn-style bg-light-purple/50 hover:bg-light-purple cursor-pointer text-purplish">
                        <Plus className="w-4 h-4 stroke-3" />
                        <p className='font-bold'>New Node</p>
                    </button>
                </div>
            }
        </div>
    )
}