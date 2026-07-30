
import { CalendarDays, Timer } from "lucide-react";
import { ReadonlyURLSearchParams } from "next/navigation";

export default async function SidebarContent({params}: {params: string | undefined}) {

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(3000);
    
    return (
        <>
            <section className="space-y-2 px-5 pt-3">
                {params}
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

            <p className="text-xs text-purple-dark/80 my-2 px-5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, eaque! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Incidunt doloribus quod consectetur nam eligendi quia, eos alias ut aperiam tenetur facilis ipsa, aut a aliquam perferendis perspiciatis fuga, ex sequi?</p>
            
            <section className="mt-auto h-10 space-y-2 z-10 border-t border-gray-200 bg-whitish px-5 py-2 mb-5 sticky bottom-0">
                <div className="flex items-center justify-between text-purple-dark/50 text-xs m-0">
                    <p>2 Items</p>
                    <span className="py-2 px-5">Comments</span>
                </div>
            </section>
        </>
    )
}