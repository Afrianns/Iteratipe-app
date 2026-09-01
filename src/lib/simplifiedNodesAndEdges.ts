import { handleEnum } from "@/types/enum"
import { timelineNodeType } from "@/types/types"
import { Edge } from "@xyflow/react"

export const simplifiedNodesAndEdges = (nodes: timelineNodeType[], edges: Edge[]) => {

    let edgeStep = 1
    let newEdges: Edge[] = []
    let newIntemedieteNodes: timelineNodeType[] = []

    for (const key in nodes) {
        const result = checkConnectedEdge(nodes[key].id, edges, nodes, edgeStep)

        if(result.target){
            let intermedieteNodeId = crypto.randomUUID()
            
            newEdges.push({
                "id": `e-${nodes[key].id}-to-${intermedieteNodeId}`,
                "source": nodes[key].id,
                "target": intermedieteNodeId
            }, 
            {
                "id": `e-${intermedieteNodeId}-to-${result.target}`,
                "source": intermedieteNodeId,
                "target": result.target
            })

            newIntemedieteNodes.push({
                "id": intermedieteNodeId,
                "position": {
                    "x": (nodes[key].position.x + result.position_x)/2 - 20,
                    "y": (nodes[key].position.y + result.position_y)/2 - 20
                },
                "data": {
                    "handleType": handleEnum.MAIN,
                    "image_url": "",
                    "title": "",
                    "type": "",
                    "content": "",
                    "start_at": "",
                    "end_at": ""
                },
                "origin": [
                    0.5,
                    0.5
                ],
                "type": "cardIntermedieteNode"
            })
        }
    }

    return { newIntemedieteNodes, newEdges };
}


const checkConnectedEdge = (id: string, edges: Edge[], nodes: timelineNodeType[], edgeStep: number) => {
    const data = edges.find((edge) => edge.source == id)
    if(!data?.target) return {
        "target": null
    }
    const existItem = nodes.find(node => node.id == data.target)
    if(existItem) {
        return {
            target: data.target,
            position_x: existItem.position.x,
            position_y: existItem.position.y
        }
    } else{
        edgeStep++
        return checkConnectedEdge(data.target, edges, nodes, edgeStep)
    }
}