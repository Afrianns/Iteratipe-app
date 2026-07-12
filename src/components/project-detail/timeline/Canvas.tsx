"use client"

import { ReactFlow, Background, Controls, MiniMap, ReactFlowProvider, Edge } from '@xyflow/react';
import { useCallback, useEffect } from 'react';
import Card from './Card';
import TimelineMenu from './CanvasMenu';
import { useTimelineStateStore } from '@/hooks/useTimelineStateStore';
import { modeEnum } from '@/types/enum';
import { timelineNodeType } from '@/types/types';
import { calledData } from '@/lib/calledData';

const nodeTypes = {
  cardNode: Card,
};


export default function Canvas({ children }: { children: React.ReactNode }) {

    const {mode, setFirstNode, setEndNode, deleteNode, setNodesChange, setConnection, setEdges, setEdgesChange, setNodes, nodes, edges } = useTimelineStateStore()

    useEffect(() => {
        calledData().then(({nodes, edges}: {nodes: timelineNodeType[], edges: Edge[]}) => {
            setNodes(nodes);
            setEdges(edges)
        });
    }, [])

    const isSpectator = mode === modeEnum.SPECTATOR;

    const confirmDeleteNodeFn = useCallback(async (nodesToDelete: { nodes: timelineNodeType[]; edges: Edge[] }) => {
        if(mode != modeEnum.DELETE) return false
        
        if(nodesToDelete?.nodes){
            nodesToDelete.nodes.forEach((node) => {
                deleteNode(node.id);
                if(node.data.handleType == "start") setFirstNode(false)
                if(node.data.handleType == "end") setEndNode(false)
            });
        }
        return confirm("are you sure?");
    }, [mode]);

    return (
        <ReactFlowProvider>
            <div className='relative h-full w-full'>
                <ReactFlow id="ReactFlow" nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={setNodesChange} 
                onConnect={setConnection}
                defaultEdgeOptions={{ type: "step", animated: true}} 
                onEdgesChange={setEdgesChange}
                 
                nodesDraggable={!isSpectator}
                nodesConnectable={!isSpectator}
                elementsSelectable={!isSpectator}
                deleteKeyCode={isSpectator ? null : ['Backspace', 'Delete']}
                onBeforeDelete={confirmDeleteNodeFn} fitView>
                    <Background />
                    <Controls showInteractive={false} />
                    <MiniMap />
                </ReactFlow>
                {children}
                <TimelineMenu />
            </div>
        </ReactFlowProvider>
    )
}