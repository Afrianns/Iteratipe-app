import CanvasTimeline from './timeline/Canvas';
import SidebarContentWrapper from './timeline/SidebarContentWrapper';

export default function Timeline({params}: {params: { node?: string | undefined}}) { 
    return (
        <CanvasTimeline>
            <SidebarContentWrapper params={params} />
        </CanvasTimeline>
    )
}