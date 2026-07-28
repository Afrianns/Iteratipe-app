"use client"

import { useProjectStore } from "@/hooks/useProjectStore"



export default function AuthorName({full_name}: {full_name: string | undefined}) {

    // const { getPopulateProject } = useProjectStore()

    // const result = getPopulateProject()

    // if(result.status != 200){
    //     return "hello"
    // }
    return (
        <span className='underline text-sm'>{full_name}</span>
    )
}