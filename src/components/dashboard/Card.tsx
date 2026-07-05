import { BaseEdge, Handle, NodeProps, Position } from '@xyflow/react';
import { CalendarDays, MoveRight, Timer } from 'lucide-react';

enum handleEnum {
    START = "start",
    MAIN = "main",
    END = "end"
}

export default function Card({data}: NodeProps) {
    let handleType = data.handleType;
    return (
        <>
            {(handleType == handleEnum.START || handleType == handleEnum.MAIN) && <Handle type="source" position={Position.Right} />}
                <div className="card-style p-5 w-70">
                    <div className="flex items-center justify-between">
                        <h3 className="h-three-style">Initial Spark & Brief</h3>
                        <span className="badge-style bg-light-green">Research</span>
                    </div>
                    <div className="flex gap-x-5 items-center text-purple-dark/50 text-[10px]">
                        <div className="flex items-center justify-between gap-2">
                            <CalendarDays className="w-3 h-3" />
                            <p>20 January 2025</p>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <Timer className="w-3 h-3" />
                            <p>2 Weeks</p>
                        </div>
                    </div>
                    <p className="text-xs text-purple-dark/80">The client wanted a radical departure from traditional 'wellness' tropes. No lotus flowers, no soft pastel gradients.</p>
                    <hr className="hr-style"/>
                    <div className="flex items-center justify-between text-purple-dark/50 text-xs m-0">
                        <p>2 Items</p>
                        <button className="py-1 px-3 bg-light-purple/50 hover:bg-light-purple cursor-pointer rounded-lg">
                            <MoveRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            {(handleType == handleEnum.END || handleType == handleEnum.MAIN) && <Handle type="target" position={Position.Left} />}
        </>
    )
}
