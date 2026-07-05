import { ArrowDownWideNarrow, ArrowUpWideNarrow, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Comments() {

    const [isIconFilterAsc, setIsIconFilterAsc] = useState<boolean>(false);
    const [stepDropdown, setStepDropdown] = useState<boolean>(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const buttonMenuRef = useRef<HTMLDivElement>(null);

    const commentFilterFn = () => setIsIconFilterAsc(!isIconFilterAsc)

    const showStepDropdownFn = () => setStepDropdown(!stepDropdown)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const clickedElement = event.target as Node;
            const buttonMenu = buttonMenuRef.current?.contains(clickedElement);
            const clickedMenu = menuRef.current?.contains(clickedElement);

            if (!buttonMenu && !clickedMenu) setStepDropdown(false);
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="px-10 py-5">
            <div className="max-w-360 mx-auto w-full">
                <div className="card-style-secondary col-span-2 max-w-200">
                    <div className="flex justify-between items-center">
                        <div className="max-w-90 w-full relative">
                            <p className="p-style">Comments from</p>
                            <div className="flex items-center justify-between hover:bg-light-gray px-3 rounded-md cursor-pointer" onClick={showStepDropdownFn} ref={buttonMenuRef}>
                                <h3 className="h-three-style">All</h3>
                                <ChevronDown className={`transition-style icon-style ${stepDropdown && 'rotate-180'}`} />
                            </div>

                            {stepDropdown && 
                                <div className="card-style p-5 absolute right-0 left-0 z-1" ref={menuRef}>
                                    <ul className="space-y-3">
                                        <li className="hover:bg-light-purple cursor-pointer py-1 px-3 rounded">All</li>
                                        <li className="hover:bg-light-purple cursor-pointer py-1 px-3 rounded">First Step</li>
                                        <li className="hover:bg-light-purple cursor-pointer py-1 px-3 rounded">Second Step</li>
                                    </ul>
                                </div>
                            }
                        </div>
                        <button onClick={commentFilterFn}>
                            {isIconFilterAsc ? 
                                <ArrowDownWideNarrow className="icon-style" />
                            :
                                <ArrowUpWideNarrow className="icon-style" />
                            }
                        </button>
                    </div>
                    <hr className="hr-style" />
                    <div className="space-y-6 mt-5">
                        <div className="flex items-start gap-x-5 justify-start w-fill">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                                <Image alt="user profile placeholder" src="/images/comment-placeholder.jpg" fill className="object-cover"/>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-x-2">
                                        <h3 className="text-md font-medium underline hover:no-underline cursor-pointer">Andreas Bunchaco</h3>
                                        <span className="badge-style bg-grayish">Author</span>
                                    </div>

                                    <span className="span-style">2 days ago</span>
                                </div>
                                <p className="p-style w-4/5">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel non aperiam inventore aut vero! Ratione, similique totam?</p>
                            </div>
                        </div>
                    </div>
                </div>      
            </div>
        </div>
    )
}