"use client"

import { useTimelineStateStore } from "@/hooks/useTimelineStateStore"
import { saveTimeline } from "@/lib/autosave";
import { timelineNodeType } from "@/types/types";
import { Edge, useEdges, useNodes, useReactFlow } from "@xyflow/react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react"
import { useShallow } from "zustand/react/shallow";

export default function CanvasSave() {

  // prevent hydration error
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  // end prevent hydration error


  const pathname = usePathname();
  const paths = pathname.split('/')


  const { globalNodes, globalEdges, lastGlobalNodes, lastGlobalEdges, setGlobalNodes, setGlobalEdges, setLastGlobalNodes, setLastGlobalEdges } = useTimelineStateStore(useShallow((state) => ({
    globalNodes: state.globalNodes,
    globalEdges: state.globalEdges,
    lastGlobalNodes: state.lastGlobalNodes,
    lastGlobalEdges: state.lastGlobalEdges,
    setGlobalNodes: state.setGlobalNodes,
    setGlobalEdges: state.setGlobalEdges,
    setLastGlobalNodes: state.setLastGlobalNodes,
    setLastGlobalEdges: state.setLastGlobalEdges
  })))

  const { setNodes, setEdges } = useReactFlow();

  const nodes = useNodes();
  const edges = useEdges();

  // check if current state of react flow is different from last saved state, if yes then show save button
  const unsaveChanges = useMemo(() => {

     const sanitizeItems = (nodes: any[]) => {
      return nodes.map(({ id, position, data, type }) => ({
        id,
        type,
        position: {
          x: Math.round(position.x * 100) / 100, // Safe rounding just in case
          y: Math.round(position.y * 100) / 100
        },
        // Keep only your custom data fields
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
    
    console.log("compare res: ", currentState === lastState, globalNodes, lastGlobalNodes)

    return currentState !== lastState;
  }, [globalNodes, globalEdges, lastGlobalEdges, lastGlobalNodes])

  // popluate react flow with global nodes and edges on initial render 
  useEffect(() => {
    if(!isClient) return;

    console.log("globalNodes", globalNodes)

    if(globalNodes.length > 0){
      setNodes(globalNodes)
    }

    if(globalEdges.length > 0){
      setEdges(globalEdges)
    }

  }, [globalEdges, globalNodes, isClient])


  // save current state of react flow to global state every 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      if(nodes.length > 0){
        setGlobalNodes(nodes as timelineNodeType[])
      }
      
      if(edges.length > 0){
        setGlobalEdges(edges as Edge[])
      }
    }, 1000)

    return () => clearTimeout(timer);
  }, [nodes, edges])


  // auto save current state of react flow to database every x seconds(i dont know how long it should be, maybe 5 minutes or 10 minutes)
  const saveCurrentState = async () => {
    let saveProcess = await saveTimeline(paths, globalEdges, globalNodes, setGlobalEdges, setGlobalNodes)
    if(saveProcess.status == 200 && saveProcess.data){
      console.log("current saved: ", globalNodes, globalEdges)
      setLastGlobalNodes(structuredClone(globalNodes))
      setLastGlobalEdges(structuredClone(globalEdges))

      console.log("last saved: ",lastGlobalNodes, lastGlobalEdges)
    }
  }

  return (
    <div className='absolute top-5 right-5 card-style h-fit transition-style rounded-none! overflow-hidden'>
      <span className="p-2 text-xs text-purplish-dark/30 mr-2 border-l-2 border-light-green hidden">Auto saving...</span>
      {unsaveChanges ? 
        <button onClick={saveCurrentState} className="py-1 px-5 border-none bg-purplish text-light-purple text-sm cursor-pointer">save</button>
      :
        <span className="py-1 px-5 border-none bg-light-gray text-grayish-dark/50 text-sm cursor-not-allowed">save</span>
      }
    </div>
  )
}