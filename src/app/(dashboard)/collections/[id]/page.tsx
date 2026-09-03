"use server"

import Main from "@/components/project-detail/Main";
import { getProjectDetailById } from "@/services/projects.service";
import { PagePropsType } from "@/types/types";
import { notFound } from "next/navigation";

interface PagePropsParamsType extends PagePropsType  { 
    params: Promise<{ id: string }>
}

export default async function DetailPage({params}: PagePropsParamsType) {
    
    const { id } = await params

    const result = await getProjectDetailById(id)
    
    if(result.status == 404) notFound()

    return (
        <>
            {(result.status == 200 && result.data) &&
                <>
                    <Main projectID={id} projectFromDB={result.data} />
                </>
            }
        </>
    )
} 
