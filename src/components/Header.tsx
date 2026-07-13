"use client"
import { Bell, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({ showSearch = true }: {showSearch?: boolean}) {
    const pathname = usePathname()
    const paths = pathname.split('/').filter((path) => path != "");

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center">
                {paths.map((path, idx) => {
                    return <div key={idx} className="flex items-center">
                        <Link href={`/${getRouteLinkFn(paths, idx)}`} className="hover:underline text-sm text-gray-500">{path}
                        </Link>
                        {(idx < paths.length-1) && 
                        <ChevronRight className="w-4 h-4 font-extralight text-grayish mx-2" /> }
                    </div>
                })}
            </div>
            {showSearch && 
                <div className="flex items-center relative w-100">
                    <Search className="text-gray-400 absolute left-2 w-5 h-5" />
                    <input type="text" name="search" className="pl-9 py-2 px-5 rounded-full border border-grayish outline-purplish focus:ring-0 text-xs w-full" placeholder="Search designs..." />
                </div>
            }
            <Bell className="icon-style" />
        </div>
    )
}


const getRouteLinkFn = (paths: string[], idx: number) => {
    let pathLink = [];
    
    for (let i = 0; i <= idx; i++) {
        pathLink.push(paths[i])
    }

    return pathLink.join("/");
}