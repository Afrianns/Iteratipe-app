import { handleTypeEnum } from '@/generated/prisma/enums';
import { modeEnum } from '@/types/enum';
import { nodeDataType, setNode, timelineNodeDataType, timelineNodeType, TimelineStateType } from '@/types/types';
import { addEdge, applyEdgeChanges, applyNodeChanges, Connection, Edge, EdgeChange, NodeChange } from '@xyflow/react';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useTimelineStateStore = create<TimelineStateType>()(
  persist((set, get) => ({
    mode: modeEnum.EDIT,
    isFirstNodeUsed: false,
    isEndNodeUsed: false,
    isEditMode: false,
    MainNodeLeft: 3,
    nodes: [],
    edges: [],
    showSidebar: false,
    getNodeById: (id: string) => get().nodes.find((node) => node.id === id),
    setIsEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
    setShowSidebar: () => set((state) => ({ showSidebar: !state.showSidebar})),

    changeMode: (mode: modeEnum) => set({ mode: mode}),
    setEdges: (newEdge: Edge[]) => set({ edges: [...newEdge] }),
    setNodes: (newNode: setNode<timelineNodeType>) => {
      if (Array.isArray(newNode)) {
          set(() => ({ 
              nodes: [...newNode] 
          }));
      } else {
          set((state) => ({ 
              nodes: [...state.nodes, newNode] 
          }));
      }
    },

    setNodesChange: (changes: NodeChange<timelineNodeType>[]) => {
      set((state) => {
          const updatedNodes = applyNodeChanges<timelineNodeType>(changes, state.nodes);
          return { nodes: updatedNodes };
      });
    },
    
    updateDataNode: (id: string, nodeData: nodeDataType) => {
      set((state) => {
        const newNodes = state.nodes.map((node: timelineNodeType) => node.id == id ? {...node, data: {...nodeData, handleType: node.data.handleType}} : node)
        return { nodes: newNodes }
      })
    },
    deleteNode: (nodeId: string) => set((state) => ({nodes: state.nodes.filter((node) => node.id !== nodeId) })),
    setFirstNode: (first: boolean) => set({ isFirstNodeUsed: first}),
    setEndNode: (end: boolean) => set({ isEndNodeUsed: end}),
    setEdgesChange: (changes: EdgeChange[]) => set((state) => {
      console.log("edges: ", changes, state)
      return { edges: applyEdgeChanges(changes, state.edges)}
    }),
    setConnection: (connection: Connection) => {
      set((state) => ({
        edges: addEdge(connection, state.edges),
      }))
    },
  }),{ 
    name: "temp-timelines-datas",
   })
);