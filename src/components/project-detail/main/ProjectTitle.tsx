import { labelType } from "@/types/types"

interface dataParamsType {
    title: string 
    Type: labelType | null
}

export default function ProjectTitle({data}: {data: dataParamsType}) {

    return (
        <>
            <h1 className="text-4xl font-bold mb-2">{data.title}</h1>
            <span className="badge-style bg-light-green">{data.Type?.name}</span>
        </>
    )
}