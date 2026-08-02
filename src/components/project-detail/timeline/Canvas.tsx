"use client"

import { ReactFlow, Background, Controls, MiniMap, ReactFlowProvider, Edge, useNodesState, useEdgesState, NodeChange, EdgeChange, Connection, addEdge } from '@xyflow/react';
import { useCallback, useEffect, useRef } from 'react';
import Card from './Card';
import TimelineMenu from './CanvasMenu';
import { useTimelineStateStore } from '@/hooks/useTimelineStateStore';
import { modeEnum } from '@/types/enum';
import { timelineNodeType } from '@/types/types';
import CanvasSave from './CanvasSave';
import { useShallow } from 'zustand/react/shallow'

const nodeTypes = {
  cardNode: Card,
};

const initialNodes: timelineNodeType[] = [];
const initialEdges: Edge[] = [];


export default function Canvas({ children }: { children: React.ReactNode }) {

    const {mode, setFirstNode, setEndNode, deleteNode, deleteEdge } = useTimelineStateStore( useShallow((state) => ({
        mode: state.mode,
        setFirstNode: state.setFirstNode,
        setEndNode: state.setEndNode,
        deleteNode: state.deleteNode,
        deleteEdge: state.deleteEdge,
    })))

    const isSpectator = mode === modeEnum.SPECTATOR;

    const [nodes,, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);


    const nodeChanges = useCallback((changes: NodeChange<timelineNodeType>[]
    ) => {
         const hasUserInteractions = changes.some(change => 
            change.type === 'position' || 
            change.type === 'select' || 
            change.type === 'remove'
        );
        if (isSpectator && hasUserInteractions) return;
        
        onNodesChange(changes);
    }, [onNodesChange, mode]);

    const edgeChanges = useCallback((changes: EdgeChange<Edge>[]) => {
         const hasUserInteractions = changes.some(change => 
            change.type === 'add' || 
            change.type === 'remove' || 
            change.type === 'replace'
        );
        if (isSpectator && hasUserInteractions) return;
        
        onEdgesChange(changes);
    }, [onEdgesChange, mode]);


    const edgeConnectionAdd = useCallback((edge: Connection) => {
        if(mode != modeEnum.EDIT) return;

          const customEdge = {
            ...edge,
            id: `e-${edge.source}-to-${edge.target}`,
        } as Edge;
        
        setEdges((oldEdges) => addEdge(customEdge, oldEdges));
    }, [setEdges, mode]);

    const nodeDeletion = useCallback(async (nodesToDelete: { nodes: timelineNodeType[]; edges: Edge[] }) => {
        if(mode != modeEnum.DELETE) return false
        
        const isConfirmed = confirm("are you sure?");

        if (!isConfirmed) return false;

        if(nodesToDelete.nodes.length > 0){
            nodesToDelete.nodes.forEach((node) => {
                console.log('check node: ',node);
                deleteNode(node.id);
                if(node.data.handleType == "start") setFirstNode(false)
                if(node.data.handleType == "end") setEndNode(false)
            });
        }

        if(nodesToDelete.edges.length > 0){
            nodesToDelete.edges.forEach((edge) => {
                deleteEdge(edge.id);
            });
        }

        return true;
    }, [mode]);

    return (
        <ReactFlowProvider>
            <div className='relative h-full w-full'>
                <ReactFlow id="ReactFlow" nodes={nodes} edges={edges} 
                nodeTypes={nodeTypes} 
                onNodesChange={nodeChanges} 
                onConnect={edgeConnectionAdd}
                defaultEdgeOptions={{ type: "step", animated: true}} 
                onEdgesChange={edgeChanges}
                deleteKeyCode={mode == modeEnum.DELETE ? ['Backspace', 'Delete'] : null}
                onBeforeDelete={nodeDeletion}
                onlyRenderVisibleElements={true}
                fitView>
                    <Background />
                    <Controls showInteractive={false} />
                    <MiniMap />
                </ReactFlow>
                {children}
                <TimelineMenu />
                <CanvasSave />
            </div>
        </ReactFlowProvider>
    )
}