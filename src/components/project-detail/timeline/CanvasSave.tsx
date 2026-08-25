"use client"

import { useTimelineStateStore } from "@/hooks/useTimelineStateStore"
import { saveTimeline, useCheckModifiedTimeline } from "@/lib/autosave";
import { timelineNodeType } from "@/types/types";
import { Edge, useEdges, useNodes, useReactFlow } from "@xyflow/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react"
import { useShallow } from "zustand/react/shallow";


export default function CanvasSave() {
  
  const pathname = usePathname();

  const unsaveChanges = useCheckModifiedTimeline();

  const { globalNodes, globalEdges, setGlobalNodes, setGlobalEdges, setBothLastAndNewEdges, setBothLastAndNewNodes } = useTimelineStateStore(useShallow((state) => ({
    globalNodes: state.globalNodes,
    globalEdges: state.globalEdges,
    lastGlobalNodes: state.lastGlobalNodes,
    lastGlobalEdges: state.lastGlobalEdges,
    setGlobalNodes: state.setGlobalNodes,
    setGlobalEdges: state.setGlobalEdges,
    setBothLastAndNewNodes: state.setBothLastAndNewNodes,
    setBothLastAndNewEdges: state.setBothLastAndNewEdges,
  })))

  
  const nodes = useNodes();
  const edges = useEdges();

  
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
  
    const paths = pathname.split("/")
    
    await saveTimeline({paths, globalNodes, globalEdges, setBothLastAndNewEdges, setBothLastAndNewNodes})
  }
  
  return (
    <div className='absolute top-5 right-5 card-style h-fit transition-style rounded-none! overflow-hidden'>
      <span className="p-2 text-xs text-main-dark/30 mr-2 border-l-2 border-light-green hidden">Auto saving...</span>
      {unsaveChanges ? 
        <span className="py-1 px-5 border-none bg-light-gray text-grayish-dark/50 text-sm cursor-not-allowed">save</span>
      :
        <button onClick={saveCurrentState} className="py-1 px-5 border-none bg-main text-secondary text-sm cursor-pointer">save</button>
      }
    </div>
  )
}