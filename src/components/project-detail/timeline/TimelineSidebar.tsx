import { CalendarDays, Timer } from "lucide-react";
import TimelineToggleSidebar from "./TimelineToggleSidebar";
import TimelineSidebarSummary from "./TimelineSidebarSummary";
import { Suspense } from "react";

export default function TimelineSidebar() {
    return (
        <TimelineToggleSidebar>
            <section className="space-y-2 px-5 pt-3">
                <div className="flex items-center justify-between">
                    <h3 className="h-three-style">Initial Spark & Brief</h3>
                    <span className="badge-style bg-light-green">Research</span>
                </div>
                <div className="flex gap-x-5 items-center text-purple-dark/50 text-[10px]">
                    <div className="flex items-center justify-between gap-2">
                        <CalendarDays className="w-3 h-3" />
                        <div className="flex items-center gap-x-2">
                            <p>20 January 2025</p>
                            -
                            <p>04 February  2025</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <Timer className="w-3 h-3" />
                        <p>2 Weeks</p>
                    </div>
                </div>
            </section>

            <Suspense fallback={<TimelineSidebarSummaryLoading />}>
                <TimelineSidebarSummary />
            </Suspense>
            
            {/* <hr className="hr-style"/> */}
            <section className="mt-auto space-y-2 z-10 border-t border-gray-200 bg-whitish px-5 py-3 mb-5 sticky bottom-0">
                <div className="flex items-center justify-between text-purple-dark/50 text-xs m-0">
                    <p>2 Items</p>
                    <button className="py-1 px-3 bg-light-purple/50 hover:bg-light-purple cursor-pointer rounded-lg text-purplish">
                        Save
                    </button>
                </div>
            </section>
        </TimelineToggleSidebar>
    )
}


const TimelineSidebarSummaryLoading = () => {
    return (
        <div className="space-y-2 pb-4 animate-pulse px-5">
            <div className="h-2 w-full bg-slate-200 rounded" />
            <div className="flex items-center gap-x-2">
                <div className="h-2 w-full bg-slate-200 rounded" />
                <div className="h-2 w-full bg-slate-200 rounded" />
            </div>
            <div className="h-2 w-full bg-slate-200 rounded" />
            <div className="flex items-center gap-x-2">
                <div className="h-2 w-2/5 bg-slate-200 rounded" />
                <div className="h-2 w-3/5 bg-slate-200 rounded" />
            </div>
            <div className="h-2 w-full bg-slate-200 rounded" />
            <div className="h-2 w-4/5 bg-slate-200 rounded" />
        </div>
    )
}