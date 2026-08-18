import { Handle, Position } from '@xyflow/react';
import { CircleAlert } from 'lucide-react';
import { memo } from 'react';

export default memo(function CardIntermediete() {
    return (
        <>
            <Handle type="source" position={Position.Right} />
                <div className="-z-2 card-style shadow-none! overflow-hidden w-fit p-5! flex flex-col items-center justify-center">
                    <CircleAlert className="w-10 h-10 stroke-main" />
                    <h1 className='h-four-style my-0!'>Some node is private</h1>
                </div>
            <Handle type="target" position={Position.Left} />
        </>
    )
})
