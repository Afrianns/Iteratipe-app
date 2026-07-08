import Main from "@/components/project-detail/Main";
import { PagePropsType } from "@/types/types";


export default function DetailPage({searchParams}: PagePropsType) {
    return (
        <Main searchParams={searchParams} />
    )
} 
