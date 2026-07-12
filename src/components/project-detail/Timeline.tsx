import CanvasTimeline from './timeline/Canvas';
import SidebarContentWrapper from './timeline/SidebarContentWrapper';

interface paramType {
    menu?: string | undefined,
    node?: string | undefined,
}

export default function Timeline({params}: {params: paramType}) { 
    return (
        <CanvasTimeline>
            <SidebarContentWrapper params={params} />
        </CanvasTimeline>
    )
}