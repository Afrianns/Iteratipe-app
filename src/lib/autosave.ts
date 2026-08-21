import { autoUpdateNodes } from "@/actions/nodes";
import { autoUpdateEdges } from "@/actions/edges";
import { setNode, timelineNodeType } from "@/types/types";
import { toast } from "sonner";
import { Edge } from "@xyflow/react";
import { clientSideErrorHandle } from "@/lib/clientErrorHandle"
import { useTimelineStateStore } from "@/hooks/useTimelineStateStore";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";
import { NodeListSchema } from "./validations";
import z from "zod";
import uploadImage from "./uploadImage";
import treeifyErrorHandling from "./treeifyErrorHandling";
import { useAuth } from "@clerk/nextjs";


interface SaveTimelineTimelineType {
  paths: string[]
  globalEdges: Edge[] 
  globalNodes: timelineNodeType[]

  setBothLastAndNewEdges: (params: Edge[]) => void
  setBothLastAndNewNodes: (nodes: timelineNodeType[]) => void
}

const URL = process.env.NEXT_PUBLIC_APP_URL

export const saveTimeline = async ({paths, globalNodes, globalEdges, setBothLastAndNewEdges, setBothLastAndNewNodes}: SaveTimelineTimelineType) => {

  console.log('be validation ',globalNodes)
  
  const user = useAuth()
  if(!user.isSignedIn) return

  const validations = NodeListSchema.safeParse(globalNodes);
  
  try{
    if(!validations.success) {
      let remapErrorMessages = treeifyErrorHandling(z.treeifyError(validations.error))
      console.log(remapErrorMessages, z.treeifyError(validations.error), globalNodes)
      throw new Error("Data is not valid!");

    }

    let edges = await saveEdges(paths, globalEdges, setBothLastAndNewEdges);
    let nodes = await saveNodes(paths, globalNodes, setBothLastAndNewNodes);

    if(nodes.status == 200 && edges.status == 200){
      toast.success("process completed")
    } else{
      toast.error("process incompleted")
      throw new Error("something went wrong")
    }

  } catch (error) {
    clientSideErrorHandle(error);
  }
}

export const saveEdges = async (paths: string[], edges: Edge[], setBothLastAndNewEdges: (params: Edge[]) => void) => {
    let result = await autoUpdateEdges(paths[2].split("%E2%80%94")[1], edges);
    
    if(result.status == 200 && result.data){
      setBothLastAndNewEdges(result.data.edges)
      return {
        status: result.status,
        message: result.message,
        data: result.data.edges
      }
    }

    return {
      status: result.status,
      message: result.message
    }
}

export const saveNodes = async (paths: string[], nodes: timelineNodeType[], setBothLastAndNewNodes: (nodes: timelineNodeType[]) => void) => {
  
  const resultBatchUpload = Promise.all(nodes.map( async (node) => {
    if(node.data.image_url.trim() != "" && node.data.image_url.startsWith(`blob:${URL}`)) {

      const uploadResult = await uploadImage(node.data.image_url)
      
      if(uploadResult.status == 200 && uploadResult.data){
        return {...node, data: {...node.data, image_url: uploadResult.data.image_url, asset_id: uploadResult.data.asset_id}}
      } else {
        return node
      }

    } else{
      return node
    }
  }))

  const newNodes = await resultBatchUpload;
  
  let result = await autoUpdateNodes(paths[2].split("%E2%80%94")[1], newNodes);
  
  if(result.status == 200 && result.data){
    setBothLastAndNewNodes(result.data.nodes)

    return {
      status: result.status,
      message: result.message,
      data: result.data.nodes
    }

  }

  return {
    status: result.status,
    message: result.message
  }
}


export const useCheckModifiedTimeline = () => {
  const user = useAuth()
  if(!user.isSignedIn) return
  
  const { globalNodes, globalEdges, lastGlobalNodes, lastGlobalEdges } = useTimelineStateStore(useShallow((state) => ({
    globalNodes: state.globalNodes,
    globalEdges: state.globalEdges,
    lastGlobalNodes: state.lastGlobalNodes,
    lastGlobalEdges: state.lastGlobalEdges
  })))


  // check if current state of react flow is different from last saved state, if yes then show save button
  const unsaveChanges = useMemo(() => {

    const sanitizeNodes = (nodes: timelineNodeType[]) => {
      return nodes.map(({ id, position, data, type }) => ({
        id,
        type,
        position: {
          x: Math.round(position.x * 100) / 100,
          y: Math.round(position.y * 100) / 100
        },
        data: {
          image_url: data.image_url,
          title: data.title,
          type: data.type,
          content: data.content,
          start_at: data.start_at,
          end_at: data.end_at,
          handleType: data.handleType
        }
      }));
    };

    const sanitizeEdges = (edges: Edge[]) => {
      return edges.map((edge) => (
        {
          id: edge.id,
          source: edge.source,
          target: edge.target
        }
      ))
    }

    
    const currentState = JSON.stringify([...sanitizeNodes(globalNodes), ...sanitizeEdges(globalEdges)]);
    const lastState = JSON.stringify([...sanitizeNodes(lastGlobalNodes), ...sanitizeEdges(lastGlobalEdges)]);
    
    // console.log("check unsaved: ", sanitizeNodes(globalNodes), sanitizeEdges(globalEdges), currentState, lastState)
    return currentState === lastState;
  }, [globalNodes, globalEdges, lastGlobalNodes, lastGlobalEdges])


  return unsaveChanges
}