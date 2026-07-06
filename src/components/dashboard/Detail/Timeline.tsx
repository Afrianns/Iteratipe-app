"use client"

import { ReactFlow, Background, Controls, applyNodeChanges, addEdge, useEdgesState, MiniMap, ReactFlowProvider, Node, Edge, NodeChange, Connection } from '@xyflow/react';
import { useCallback, useEffect, useState } from 'react';
import Card from '../Card';
import TimelineMenu from '../TimelineMenu';
import { useTimelineStateStore } from '@/hooks/useTimelineStateStore';
import { modeEnum } from '@/types/enum';

const nodeTypes = {
  cardNode: Card,
};


// let initialNodes: Node[] = [];
//   {
//     id: 'initial-node',
//     position: { x: 0, y: 0 },
//     data: { label: 'Node 1' },
//     type: 'cardInitial',
//     draggable: false,
//     deletable: false,
//   }

let initialEdges: Edge[] = [];

// {
//     id: 'n1-n2',
//     source: 'n1',
//     target: 'n2',
// }

export default function Timeline() {
    const {mode, setFirstNode, setEndNode, deleteNode, setNodesChange, setConnection, setEdgesChange, Nodes, Edges } = useTimelineStateStore()

    const [initialNodes, setInitialNodes] = useState<Node[]>([]);
 
    // const [nodes, setNodes] = useState<Node[]>(Nodes);

    
    // const onNodesChange = useCallback(
        //     (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),[],
    // );
    // const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);

    // const onConnect = useCallback(
    //     (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    //     [setEdges],
    // );

    const isSpectator = mode === modeEnum.SPECTATOR;

    const confirmDeleteNodeFn = useCallback(async (nodesToDelete: { nodes: Node[]; edges: Edge[] }) => {
        if(mode != modeEnum.DELETE) return false
        
        if(nodesToDelete?.nodes){
            nodesToDelete.nodes.forEach(node => {
                deleteNode(node.id);
                if(node.id == "start") setFirstNode(false)
                if(node.id == "end") setEndNode(false)
            });
        }
        return confirm("are you sure?");
    }, [mode]);

    return (
        <ReactFlowProvider>
            <div className='relative h-full w-full'>
                <ReactFlow id="ReactFlow" nodes={Nodes} edges={Edges} nodeTypes={nodeTypes} onNodesChange={setNodesChange} 
                onConnect={setConnection}
                defaultEdgeOptions={{ type: "step", animated: true}} 
                onEdgesChange={setEdgesChange}
                 
                nodesDraggable={!isSpectator}
                nodesConnectable={!isSpectator}
                elementsSelectable={!isSpectator}
                deleteKeyCode={isSpectator ? null : ['Backspace', 'Delete']}
                onBeforeDelete={confirmDeleteNodeFn} fitView>
                    <Background />
                    <Controls />
                    <MiniMap />
                </ReactFlow>
                <TimelineMenu />
            </div>
        </ReactFlowProvider>
    )
}