import { Bell, Search } from "lucide-react";

export default function Header() {

    return (
        <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Explore</span>

            <div className="flex items-center relative w-100">
                <Search className="text-gray-400 absolute left-2 w-5 h-5" />
                <input type="text" name="search" className="pl-9 py-2 px-5 rounded-full border border-grayish outline-purplish focus:ring-0 text-xs w-full" placeholder="Search designs..." />
            </div>

            <Bell className="icon-style" />
        </div>
    )
}
