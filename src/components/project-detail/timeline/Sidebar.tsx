"use client"

import { MoveLeft, SquarePen } from "lucide-react";
import TimelineSidebarEdit from "./SidebarFormEdit";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export default function Sidebar({ children }: {children: React.ReactNode }) {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const { isSignedIn } = useAuth()

    const data = useSearchParams()

    return (
        <div className={`card-style absolute transition-style right-0 top-0 overflow-y-auto h-full flex flex-col z-1 ${data.get("node") ? 'w-140' : 'w-0'}`}>
            <section className="p-5 pb-0 flex items-center justify-between mb-5">
                <Link href="?menu=timeline" className="py-1 px-3 bg-light-gray hover:bg-grayish/50 cursor-pointer rounded-lg">
                    <MoveLeft className="w-5 h-5 text-grayish-dark" />
                </Link>

                {isSignedIn &&
                    <button type="button" onClick={() => setIsEdit(!isEdit)} className={`transiton-style rounded-full cursor-pointer flex items-center gap-x-2 py-2 px-5 ${ isEdit ?'bg-secondary hover:bg-main/10 text-main' : 'bg-light-gray hover:bg-grayish text-grayish-dark'}`}>
                        {isEdit && 
                            <span className="text-xs font-extralight">Edit</span>
                        }
                        <SquarePen className="w-3 h-3" />
                    </button>
                }
            </section>
            {isEdit && isSignedIn ? 
                <TimelineSidebarEdit />
            :
                <>
                    {children}
                </>
            }
        </div>
    )
}
