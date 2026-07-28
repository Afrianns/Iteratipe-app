import Main from "@/components/project-detail/Main";

import { getProjectDetailById } from "@/services/projects.service";
import { PagePropsType, WithPivotDataType } from "@/types/types";

interface PagePropsParamsType extends PagePropsType  { 
    params: Promise<{ id: string }>
}

export let initialProject: WithPivotDataType = {
    id: 0,
    created_at: new Date(),
    uid: "",
    user_id: 0,
    type_id: 0,
    title: "",
    summary: "",
    visibility: "PUBLIC",
    disable_comments: false,
    client_name: "",
    updated_at: null,
    status_id: 0,
    Status: {
        id: 0,
        name: ""
    },
    Type: {
        id: 0,
        name: ""
    },
    Users: {
        id: 0,
        full_name: "",
        clerk_user_id: ""
    },
    Project_tags: [],
    Project_tools: [],

}

export default async function DetailPage({params, searchParams}: PagePropsParamsType) {
    
    let project: WithPivotDataType = initialProject

    const { id } = await params
    const result = await getProjectDetailById(id.split("%E2%80%94")[1])

    if(result.status == 200 && result.data){
        project = result.data 
    }

    console.log(params, searchParams)

    return (
        <Main searchParams={searchParams} project={project} />
    )
} 
