import { ReactFlow, Background, Controls, applyEdgeChanges, applyNodeChanges, addEdge, useEdgesState, MiniMap, ReactFlowProvider, Node, Edge, NodeChange, Connection, EdgeChange } from '@xyflow/react';
import { useCallback, useState } from 'react';
import Card from '../Card';
import TimelineMenu from '../TimelineMenu';

const nodeTypes = {
  cardNode: Card,
};


const initialNodes: Node[] = [];
//   {
//     id: 'initial-node',
//     position: { x: 0, y: 0 },
//     data: { label: 'Node 1' },
//     type: 'cardInitial',
//     draggable: false,
//     deletable: false,
//   }

const initialEdges: Edge[] = [];

// {
//     id: 'n1-n2',
//     source: 'n1',
//     target: 'n2',
// }

export default function Timeline() {

    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    
    const [edges, setEdges, onEdgesChanges] = useEdgesState<Edge>(initialEdges);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );

    const onConnect = useCallback(
        (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );

    return (
        <ReactFlowProvider>
            <div className='relative h-full w-full'>
                <ReactFlow nodes={nodes} edges={edges}  nodeTypes={nodeTypes} onNodesChange={onNodesChange} onConnect={onConnect} defaultEdgeOptions={{type: "step", animated: true}} onEdgesChange={onEdgesChanges} fitView>
                    <Background />
                    <Controls />
                    <MiniMap />
                </ReactFlow>
                <TimelineMenu />
            </div>
        </ReactFlowProvider>
    )
}