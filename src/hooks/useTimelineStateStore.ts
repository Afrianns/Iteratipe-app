import { updateNode } from '@/actions/nodes';
import { modeEnum } from '@/types/enum';
import { nodeDataType, setNode, timelineNodeType, TimelineStateType } from '@/types/types';
import { addEdge, applyEdgeChanges, Connection, Edge, EdgeChange } from '@xyflow/react';
import { create } from 'zustand'

export const useTimelineStateStore = create<TimelineStateType>()(
  // persist(
    (set, get) => ({
    mode: modeEnum.EDIT,
    isStartNodeUsed: false,
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
    setGlobalEdges: (newEdge: Edge[]) => set({ globalEdges: newEdge }),

    setBothLastAndNewEdges: (newEdge: Edge[]) => set({ globalEdges: newEdge, lastGlobalEdges: newEdge }),
    setBothLastAndNewNodes: (newNodes: timelineNodeType[]) => set({ globalNodes: newNodes, lastGlobalNodes: newNodes }),

    setGlobalNodes: (newNode: setNode<timelineNodeType>) => {
      if (Array.isArray(newNode)) {
          set(() => ({ 
              globalNodes: newNode
          }));
      } else {
        set((state) => ({ 
            globalNodes: [...state.globalNodes, newNode],
            unsavedChanges: true
        }));
      }
    },

    updateSingleNodeToLastAndCurrent: (nodeToUpdate: timelineNodeType) => {
      set((state) => {
        const updatedNode = state.globalNodes.map((node: timelineNodeType) => node.id == nodeToUpdate.id ? nodeToUpdate : node);
        const updatedLastNode = state.lastGlobalNodes.map((node: timelineNodeType) => node.id == nodeToUpdate.id ? nodeToUpdate : node);
        
        return {
          globalNodes: updatedNode,
          lastGlobalNodes: updatedLastNode,
        }
      })
    },
    updateSingleNode: (nodeToUpdate: timelineNodeType) => {
      set((state) => {
        const updatedNode = state.globalNodes.map((node: timelineNodeType) => node.id == nodeToUpdate.id ? nodeToUpdate : node);        
        return {
          globalNodes: updatedNode,
        }
      })
    },

    deleteNode: (nodeId: string) => set((state) => {
      return {
        globalNodes: state.globalNodes.filter((node) => node.id !== nodeId),
      }
    }),
    deleteEdge: (edgeId: string) => set((state) => {
      return {
        globalEdges: state.globalEdges.filter((edge) => edge.id !== edgeId),
      }
    }),
    setStartNode: (first: boolean) => set({ isStartNodeUsed: first}),
    setEndNode: (end: boolean) => set({ isEndNodeUsed: end}),
    setEdgesChange: (changes: EdgeChange[]) => set((state) => {
      return { 
        globalEdges: applyEdgeChanges(changes, state.globalEdges),
      }
    
    }),
    setConnection: (connection: Connection) => {
      set((state) => ({
        globalEdges: addEdge(connection, state.globalEdges),
      }))
    },

    resetTimeline: () => {
      set(() => ({
          mode: modeEnum.EDIT,
          isStartNodeUsed: false,
          isEndNodeUsed: false,
          MainNodeLeft: 3,
          globalNodes: [],
          globalEdges: [],
          lastGlobalNodes: [],
          lastGlobalEdges: [],
      }))
    }
  })
);


