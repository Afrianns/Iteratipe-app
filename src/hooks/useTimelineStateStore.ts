import { modeEnum } from '@/types/enum';
import { TimelineStateType } from '@/types/types';
import { addEdge, applyEdgeChanges, applyNodeChanges, Connection, EdgeChange, Node, NodeChange } from '@xyflow/react';
import { create } from 'zustand'


export const useTimelineStateStore = create<TimelineStateType>((set) => ({
  mode: modeEnum.EDIT,
  isFirstNodeUsed: false,
  isEndNodeUsed: false,
  MainNodeLeft: 3,
  Nodes: [],
  Edges: [],
  changeMode: (mode: modeEnum) => set({ mode: mode}),
  setNodes: (newNode: Node) => set((state) => ({Nodes: [...state.Nodes, newNode]})),
  setNodesChange: (changes: NodeChange[]) => {
    set((state) => {
        const updatedNodes = applyNodeChanges(changes, state.Nodes);
        
        return { Nodes: updatedNodes };
    });
  },
  deleteNode: (nodeId: string) => set((state) => ({Nodes: state.Nodes.filter((node: Node) => node.id !== nodeId) })),
  setFirstNode: (first: boolean) => set({ isFirstNodeUsed: first}),
  setEndNode: (end: boolean) => set({ isEndNodeUsed: end}),
  setEdgesChange: (changes: EdgeChange[]) => set((state) => ({ Edges: applyEdgeChanges(changes, state.Edges)})),
  setConnection: (connection: Connection) => {
    set((state) => ({
      Edges: addEdge(connection, state.Edges),
    }))
  },
}));