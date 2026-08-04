import { autoUpdateNodes } from "@/actions/nodes";
import { autoUpdateEdges } from "@/actions/edges";
import { returnDataType, setNode, timelineNodeType } from "@/types/types";
import { toast } from "sonner";
import { Edge } from "@xyflow/react";
import { tempErrorHandle } from "./tempErrorHandle";
import { useTimelineStateStore } from "@/hooks/useTimelineStateStore";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { NodeListSchema } from "./validations";
import z from "zod";


interface SaveTimelineTimelineType {
  paths: string[] 
  globalEdges: Edge[] 
  globalNodes: timelineNodeType[] 
  setGlobalNodes: (params: setNode<timelineNodeType>) => void 
  setGlobalEdges: (params: Edge[]) => void
}

export const saveTimeline = async ({paths, globalEdges, globalNodes, setGlobalNodes, setGlobalEdges}: SaveTimelineTimelineType): Promise<returnDataType<{
  result_nodes: {
    status: number,
    node: timelineNodeType[]
  },
  result_edges: {
    status: number,
    edges: Edge[]
  }
}>> => {

  const validations = NodeListSchema.safeParse(globalNodes);
  
  try{
    if(!validations.success) {
      console.log(z.flattenError(validations.error))
      throw new Error("Data is not valid!");
    }

    let edges = await saveEdges(paths, globalEdges, setGlobalEdges);
    let nodes = await saveNodes(paths, globalNodes, setGlobalNodes);

    return {
      status: 200,
      message: "Process completed",
      data: {
        result_nodes: {
          status: nodes.status,
          node: nodes.data
        },
        result_edges: {
          status: edges.status,
          edges: edges.data
        }
      }

    }
  } catch (error) {
    return tempErrorHandle(error);
  }
}

export const saveEdges = async (paths: string[], edges: Edge[], setEdges: (edges: Edge[]) => void) => {
    let result = await autoUpdateEdges(paths[2].split("%E2%80%94")[1], edges);
    
    if(result.status == 200 && result.data){
      setEdges(result.data.edges)
      toast.success(result.message)
      return {
        status: result.status,
        data: result.data.edges
      }
    }

    if(result.status == 500){
      toast.warning(result.message)
      console.log(result)
    }

     return {
      status: result.status,
      data: []
    }
}

export const saveNodes = async (paths: string[], nodes: timelineNodeType[], setNodes: (nodes: setNode<timelineNodeType>) => void) => {
  
    let result = await autoUpdateNodes(paths[2].split("%E2%80%94")[1], nodes);
    
    if(result.status == 200 && result.data){
      setNodes(result.data.nodes)
      toast.success(result.message)
      return {
        status: result.status,
        data: result.data.nodes
      }

    }
    
    if(result.status == 500){
      toast.warning(result.message)
      console.log(result)
    }
    
    return {
      status: result.status,
      data: []
    }
}


export const useCheckModifiedTimeline = () => {
  const { globalNodes, globalEdges, lastGlobalNodes, lastGlobalEdges } = useTimelineStateStore(useShallow((state) => ({
    globalNodes: state.globalNodes,
    globalEdges: state.globalEdges,
    lastGlobalNodes: state.lastGlobalNodes,
    lastGlobalEdges: state.lastGlobalEdges
  })))


  // check if current state of react flow is different from last saved state, if yes then show save button
  const unsaveChanges = useMemo(() => {

    const sanitizeItems = (nodes: any[]) => {
      return nodes.map(({ id, position, data, type }) => ({
        id,
        type,
        position: {
          x: Math.round(position.x * 100) / 100,
          y: Math.round(position.y * 100) / 100
        },
        data: {
          title: data.title,
          type: data.type,
          content: data.content,
          start_at: data.start_at,
          end_at: data.end_at,
          handleType: data.handleType
        }
      }));
    };
    const currentState = JSON.stringify([...sanitizeItems(globalNodes), ...globalEdges]);
    const lastState = JSON.stringify([...sanitizeItems(lastGlobalNodes), ...lastGlobalEdges]);
    
    return currentState === lastState;
  }, [globalNodes, globalEdges, lastGlobalNodes, lastGlobalEdges])


  return unsaveChanges
}