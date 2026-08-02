import { handleTypeEnum } from '@/generated/prisma/enums';
import { modeEnum } from '@/types/enum';
import { nodeDataType, setNode, timelineNodeDataType, timelineNodeType, TimelineStateType } from '@/types/types';
import { addEdge, applyEdgeChanges, applyNodeChanges, Connection, Edge, EdgeChange, NodeChange } from '@xyflow/react';
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import localforage from "localforage"

export const useTimelineStateStore = create<TimelineStateType>()(
  persist((set, get) => ({
    mode: modeEnum.EDIT,
    isFirstNodeUsed: false,
    isEndNodeUsed: false,
    MainNodeLeft: 3,
    globalNodes: [],
    globalEdges: [],
    lastGlobalNodes: [],
    lastGlobalEdges: [],
    
    // temporary solution for sidebar state management, will be removed in future updates
    getNodeById: (id: string) => get().globalNodes.find((node) => node.id === id),

    changeMode: (mode: modeEnum) => set({ mode: mode}),

    // last global nodes and edges are used to store the last state of the timeline before saving.
    setLastGlobalEdges: (newEdge: Edge[]) => set({ lastGlobalEdges: newEdge }),
    setLastGlobalNodes: (newNode: timelineNodeType[]) => set({ lastGlobalNodes: newNode }),
    setGlobalEdges: (newEdge: Edge[]) => set({ globalEdges: [...newEdge] }),

    setGlobalNodes: (newNode: setNode<timelineNodeType>) => {
      if (Array.isArray(newNode)) {
          set(() => ({ 
              globalNodes: [...newNode] 
          }));
      } else {
        set((state) => ({ 
            globalNodes: [...state.globalNodes, newNode],
            unsavedChanges: true
        }));
      }
    },
    
    updateDataNode: (id: string, nodeData: nodeDataType) => {
      
      set((state) => {
        const newNodes = state.globalNodes.map((node: timelineNodeType) => node.id == id ? {...node, data: {...nodeData, handleType: node.data.handleType}} : node)
        return { 
          globalNodes: newNodes,
          unsavedChanges: true
        }
      })
    },
    deleteNode: (nodeId: string) => set((state) => {
      return {
        globalNodes: state.globalNodes.filter((node) => node.id !== nodeId),
        unsavedChanges: true
      }
    }),
    deleteEdge: (edgeId: string) => set((state) => {
      return {
        globalEdges: state.globalEdges.filter((edge) => edge.id !== edgeId),
        unsavedChanges: true
      }
    }),
    setFirstNode: (first: boolean) => set({ isFirstNodeUsed: first}),
    setEndNode: (end: boolean) => set({ isEndNodeUsed: end}),
    setEdgesChange: (changes: EdgeChange[]) => set((state) => {
      return { 
        globalEdges: applyEdgeChanges(changes, state.globalEdges),
        unsavedChanges: true
      }
    
    }),
    setConnection: (connection: Connection) => {
      set((state) => ({
        globalEdges: addEdge(connection, state.globalEdges),
        unsavedChanges: true
      }))
    },
  }),{ 
    name: "temp-timelines-datas",
    storage: createJSONStorage(() => localforage),
    partialize: (state) => ({
        globalNodes: state.globalNodes,
        globalEdges: state.globalEdges,
        lastGlobalNodes: state.lastGlobalNodes,
        lastGlobalEdges: state.lastGlobalEdges,
        mode: state.mode,
        isFirstNodeUsed: state.isFirstNodeUsed,
        isEndNodeUsed: state.isEndNodeUsed,
        MainNodeLeft: state.MainNodeLeft
      })
   })
);


