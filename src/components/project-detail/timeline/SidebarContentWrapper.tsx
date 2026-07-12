import { CalendarDays, Timer } from "lucide-react";
import { Suspense } from "react";
import Sidebar from "./Sidebar";
import SidebarContent from "./SidebarContent";

interface paramType {
    menu?: string | undefined,
    node?: string | undefined,
}

export default function SidebarContentWrapper({params}: {params: paramType}) {

    const currentNodeId = params.node || "empty"
    return (
        <Sidebar>
            <Suspense key={currentNodeId} fallback={<TimelineSidebarLoading/>}>
                <SidebarContent />
            </Suspense>
        </Sidebar>
    )
}

const TimelineSidebarLoading = () => {
    return (
        <div className="animate-pulse flex flex-col h-full">
            <section className="space-y-2 px-5 pt-3">
                <div className="flex items-center justify-between">
                    <div className="h-6 w-44 bg-slate-200 rounded" />
                    <div className="h-5 w-16 bg-slate-200 rounded-full" />
                </div>
                
                <div className="flex gap-x-5 items-center pt-1">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-slate-200 rounded-sm" />
                        <div className="h-3 w-36 bg-slate-200 rounded" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-slate-200 rounded-sm" />
                        <div className="h-3 w-12 bg-slate-200 rounded" />
                    </div>
                </div>
            </section>

            <section className="px-5 pt-4 space-y-2 mb-4">
                <div className="flex items-center gap-x-2">
                    <div className="h-3 w-3/5 bg-slate-200 rounded" />
                    <div className="h-3 w-2/5 bg-slate-200 rounded" />
                </div>
                <div className="flex items-center gap-x-2">
                    <div className="h-3 w-4/6 bg-slate-200 rounded" />
                    <div className="h-3 w-2/6 bg-slate-200 rounded" />
                </div>
                <div className="h-3 w-full bg-slate-200 rounded" />
                <div className="h-3 w-1/3 bg-slate-200 rounded" />
            </section>
            
            <section className="mt-auto space-y-2 z-10 border-t border-gray-200 bg-whitish px-5 py-3 mb-5 sticky bottom-0">
                <div className="flex items-center justify-between m-0">
                    <div className="h-4 w-12 bg-slate-200 rounded" />
                </div>
            </section>
        </div>
    )
}