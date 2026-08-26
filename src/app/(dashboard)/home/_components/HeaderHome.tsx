import { getAuthProjectCounts } from "@/services/projects.service";
import { auth } from "@clerk/nextjs/server";
import { CircleCheck, Clock4, Layers } from "lucide-react";
import PopupMessage from "./PopupMessage";

export default async function HeaderHome() {

    let quickStatus = {
        total: 0,
        pending: 0,
        in_progress: 0,
        completed: 0
    }
    
    const {userId} = await auth()

    if(userId){
        const result = await getAuthProjectCounts(userId)
        if(result.status == 200 && result.data)
            quickStatus = result.data
    }

    return (
        <>
            <PopupMessage />
            <div className="card-style-secondary card-home-list-style">
                <div>
                    <p className="text-sm text-main-text/40 font-bold">Total Projects.</p>
                    <h2 className="text-4xl font-semibold font-main">{quickStatus.total}</h2>
                </div>
                <div className="p-2 bg-main/10 rounded-full text-main">
                    <Layers strokeWidth={3} width={50} />
                </div>
            </div>
            <div className="card-style-secondary card-home-list-style">
                <div>
                    <p className="text-sm text-main-text/40 font-bold">Completed Projects.</p>
                    <h2 className="text-4xl font-semibold font-main">{quickStatus.completed}</h2>
                </div>
                <div className="p-2 bg-[#49c12b]/10 rounded-full text-[#49c12b]">
                    <CircleCheck strokeWidth={3} width={50} />
                </div>
            </div>
            <div className="card-style-secondary card-home-list-style">
                <div>
                    <p className="text-sm text-main-text/40 font-bold">In Progress Projects.</p>
                    <h2 className="text-4xl font-semibold font-main">{quickStatus.in_progress}</h2>
                </div>
                <div className="p-2 bg-[#dce400]/10 rounded-full text-[#dce400]">
                    <Clock4 strokeWidth={3} width={50} />
                </div>
            </div>
            <div className="card-style-secondary card-home-list-style">
                <div>
                    <p className="text-sm text-main-text/40 font-bold">Pending Projects.</p>
                    <h2 className="text-4xl font-semibold font-main">{quickStatus.pending}</h2>
                </div>
                <div className="p-2 bg-[#e49c00]/10 rounded-full text-[#e49c00]">
                    <Clock4 strokeWidth={3} width={50} />
                </div>
            </div>
        </>
    )
}