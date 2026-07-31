"use client"
import { autoUpdateNodes } from "@/actions/nodes";
import { useTimelineStateStore } from "@/hooks/useTimelineStateStore"
import { getTotalNodesByProjectId } from "@/services/nodes.service";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react"

export default function CanvasSave() {

  const pathname = usePathname();

  let totalNodes = 0;

  const [nodeChanges, setNodeChanges] = useState<boolean>(false)
  const { nodes, edges, setNodes } = useTimelineStateStore()

  const paths = pathname.split('/')

  useEffect(() => {
    const getNodesData = async () => {
      const result = await getTotalNodesByProjectId(paths[2].split("%E2%80%94")[1])
      console.log("getting started", result)

      if(result.status == 200 && result.data?.count){
        totalNodes = result.data.count
        changeSaveMode()
      }
    }
    getNodesData()
  }, [])


  useEffect(() => {
    
    // if(nodes.length > 0 && edges.length > 0){
      
    let times = setInterval(() => {
      console.log("counting")
    }, 10000)
      
    changeSaveMode()
    console.log("on save component: ", nodes, edges)

    return () => clearInterval(times)
    // }
  
    /*
    */

    // {
    //     "id": "step-1",
    //     "position": {
    //         "x": 440.3941620446585,
    //         "y": 292.30176717583527
    //     },
    //     "data": {
    //         "handleType": "start",
    //         "title": "",
    //         "type": "",
    //         "start_at": "",
    //         "end_at": "",
    //         "content": ""
    //     },
    //     "origin": [
    //         0.5,
    //         0.5
    //     ],
    //     "type": "cardNode",
    //     "measured": {
    //         "width": 320,
    //         "height": 203
    //     },
    //     "selected": true,
    //     "dragging": false
    // }

  }, [nodes, edges])

  const changeSaveMode = () => {
    if(nodes.length > totalNodes && !nodeChanges) {
      setNodeChanges(true)
    }
  }

  const saveCurrentState = async () => {
    setNodeChanges(false)
    let result = await autoUpdateNodes(paths[2].split("%E2%80%94")[1], nodes);
    
    if(result.status == 200 && result.data){
      setNodes(result.data.nodes)
    }
    console.log(result)
  }

  return (
    <div className='absolute top-5 right-5 card-style h-fit transition-style rounded-none! overflow-hidden'>
      <span className="p-2 text-xs text-purplish-dark/30 mr-2 border-l-2 border-light-green hidden">Auto saving...</span>
      {nodeChanges ? 
        <button onClick={saveCurrentState} className="py-1 px-5 border-none bg-purplish text-light-purple text-sm cursor-pointer">save</button>
      :
        <span className="py-1 px-5 border-none bg-light-gray text-grayish-dark/50 text-sm cursor-not-allowed">save</span>
      }
    </div>
  )
}