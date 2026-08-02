import { autoUpdateNodes } from "@/actions/nodes";
import { autoUpdateEdges } from "@/actions/edges";
import { returnDataType, setNode, timelineNodeType } from "@/types/types";
import { toast } from "sonner";
import { Edge } from "@xyflow/react";
import { tempErrorHandle } from "./tempErrorHandle";


export const saveTimeline = async (paths: string[], edges: Edge[], nodes: timelineNodeType[], setEdges: (edges: Edge[]) => void, setNodes: (nodes: setNode<timelineNodeType>) => void): Promise<returnDataType<{
  nodes: number,
  edges: number
}>> => {

  try{
    let statusEdges = await saveEdges(paths, edges, setEdges);
    let statusNodes = await saveNodes(paths, nodes, setNodes);


    return {
      status: 200,
      message: "Process completed",
      data: {
        nodes: statusNodes,
        edges: statusEdges,
      }
    }
    // console.log("updated status: ", statusNodes, statusEdges)
  } catch (error) {
    return tempErrorHandle(error);
  }

}

export const saveEdges = async (paths: string[], edges: Edge[], setEdges: (edges: Edge[]) => void) => {
    let result = await autoUpdateEdges(paths[2].split("%E2%80%94")[1], edges);
    
    if(result.status == 200 && result.data){
      setEdges(result.data.edges)
      toast.success(result.message)
    }

    if(result.status == 500){
      toast.warning(result.message)
      console.log(result)
    }

    return result.status
}

export const saveNodes = async (paths: string[], nodes: timelineNodeType[], setNodes: (nodes: setNode<timelineNodeType>) => void) => {
    
    let result = await autoUpdateNodes(paths[2].split("%E2%80%94")[1], nodes);
    
    if(result.status == 200 && result.data){
      setNodes(result.data.nodes)
      toast.success(result.message)

    }
    
    if(result.status == 500){
      toast.warning(result.message)
      console.log(result)
    }

    return result.status
}