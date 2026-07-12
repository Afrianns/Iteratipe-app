import { modeEnum } from '@/types/enum';
import { nodeDataEditType, setNode, timelineNodeDataType, timelineNodeType, TimelineStateType } from '@/types/types';
import { addEdge, applyEdgeChanges, applyNodeChanges, Connection, Edge, EdgeChange, NodeChange } from '@xyflow/react';
import { create } from 'zustand'


export const useTimelineStateStore = create<TimelineStateType>((set) => ({
  mode: modeEnum.EDIT,
  isFirstNodeUsed: false,
  isEndNodeUsed: false,
  isEditMode: false,
  MainNodeLeft: 3,
  nodes: [],
  edges: [],
  showSidebar: false,
  nodeDataEdit: {
    title: "",
    startDate: "Fri Jul 10 2026 15:26:07 GMT+0700 (Western Indonesia Time)",
    endDate: "Fri Jul 17 2026 15:26:07 GMT+0700 (Western Indonesia Time)",
    type: "",
    content: "",
  },
  setNodeDataEdit: (data: nodeDataEditType) => set({ 
    nodeDataEdit: {
      title: data.title,
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
      content: data.content
  }}),
  setIsEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
  setShowSidebar: () => set((state) => ({ showSidebar: !state.showSidebar})),
  changeMode: (mode: modeEnum) => set({ mode: mode}),
  setEdges: (newEdge: Edge[]) => set({ edges: [...newEdge] }),
  setNodes: (newNode: setNode<timelineNodeType>) => {
    if (Array.isArray(newNode)) {
        set((state) => ({ 
            nodes: [...newNode] 
        }));
    } else {
        set((state) => ({ 
            nodes: [...state.nodes, newNode] 
        }));
    }
  },
  setNodesChange: (changes: NodeChange[]) => {
    set((state) => {
        const updatedNodes = applyNodeChanges<timelineNodeType>(changes, state.nodes);
        return { nodes: updatedNodes };
    });
  },
  updateDataNode: (data: timelineNodeDataType) => set((state) => ({
      
  })),
  deleteNode: (nodeId: string) => set((state) => ({nodes: state.nodes.filter((node) => node.id !== nodeId) })),
  setFirstNode: (first: boolean) => set({ isFirstNodeUsed: first}),
  setEndNode: (end: boolean) => set({ isEndNodeUsed: end}),
  setEdgesChange: (changes: EdgeChange[]) => set((state) => ({ edges: applyEdgeChanges(changes, state.edges)})),
  setConnection: (connection: Connection) => {
    set((state) => ({
      edges: addEdge(connection, state.edges),
    }))
  },
}));