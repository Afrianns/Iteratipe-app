import { handleEnum } from "@/types/enum";
import { timelineNodeDataType, timelineNodeType } from "@/types/types";
import { Edge } from "@xyflow/react";

let datas: timelineNodeDataType[] = [
    {
        title: "Initial Spark & Brief",
        type: "Brainstorm",
        start_at: "1 January 2025",
        end_at: "15 January 2025",
        content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore recusandae tempore voluptatum tempora adipisci, repellendus repellat illum commodi error iste est eaque molestias doloremque modi ipsum enim iure aliquam eos. Recusandae tempore voluptatum tempora adipisci, repellendus repellat illum commodi error iste est eaque molestias doloremque modi ipsum enim iure aliquam eos.",
    },
    {
        title: "Wireframing The Design",
        type: "wireframe",
        start_at: "20 January 2025",
        end_at: "27 January 2025",
        content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore recusandae tempore voluptatum tempora adipisci, repellendus repellat illum commodi error iste est eaque molestias doloremque modi ipsum enim iure aliquam eos. Recusandae tempore voluptatum tempora adipisci, repellendus repellat illum commodi error iste est eaque molestias doloremque modi ipsum enim iure aliquam eos.",
    },
    {
        title: "Logo Final Design",
        type: "result",
        start_at: "1 February 2025",
        end_at: "5 January 2025",
        content: "Dolor sit amet, consectetur adipisicing elit. Dolore recusandae tempore voluptatum tempora adipisci, repellendus repellat illum commodi error iste est eaque molestias doloremque modi ipsum enim iure aliquam eos. Recusandae tempore voluptatum tempora adipisci, repellendus repellat illum commodi error iste est eaque molestias doloremque modi ipsum enim iure aliquam eos.",
    }
]

let timelineNode: timelineNodeType[] = []

let edges: Edge[] = [
    {
        id: "edge-0",
        source: "step-0",
        target: "step-1"
    },
    {
        id: "edge-1",
        source: "step-1",
        target: "step-2"
    }
]

export const getNodes = async () => {
    
    // let nodes: timelineNodeType[] = []

    // const delay = (ms: number) => new Promise<timelineNodeType[]>((resolve) => setTimeout(() => {
    //     const d: timelineNodeType[] = [
    //         {
    //             id: "step-0",
    //             position: {x: 100, y: 0},
    //             data: { 
    //                 handleType: handleEnum.START,
    //                 ...datas[0]
    //             },
    //             origin: [0.5, 0.5],
    //             type: 'cardNode',
    //         },
    //         {
    //             id: "step-1",
    //             position: {x: 500, y: 50},
    //             data: { 
    //                 handleType: handleEnum.MAIN,
    //                 ...datas[1]
    //             },
    //             origin: [0.5, 0.5],
    //             type: 'cardNode',
    //         },
    //         {
    //             id: "step-2",
    //             position: {x: 900, y: -50},
    //             data: { 
    //                 handleType: handleEnum.END,
    //                 ...datas[2]
    //             },
    //             origin: [0.5, 0.5],
    //             type: 'cardNode',
    //         }
    //     ]
    //     return resolve(d);
    // }, ms));

    // nodes = await delay(3000)

    return { nodes: [], edges: [] };
}