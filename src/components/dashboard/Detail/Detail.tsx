"use client"
import '@xyflow/react/dist/style.css';

import Header from "../Header";
import Sidebar from "../Sidebar";
import { Bookmark, Heart } from 'lucide-react';
import Timeline from './Timeline';
import Overview from './Overview';
import Comments from './Comments';
import Settings from './Settings';
import { useEffect, useState } from 'react';


type subMenuType = "timeline" | "overview" | "comments" | "settings";

export default function Detail() {

    const [subMenu, setSubMenu] = useState<React.ReactNode>(<Timeline/>)
    const [currentSubMenu, setCurrentSubMenu] = useState<subMenuType>("timeline");
    
    useEffect(() => {
        changeSubMenu("timeline");
    },[])

    const changeSubMenu = (e: subMenuType) => {
        
        setCurrentSubMenu(e);

        switch (e) {
            case "timeline":
                setSubMenu(<Timeline />);
                break;
            case "overview":
                setSubMenu(<Overview />);
                break;
            case "comments":
                setSubMenu(<Comments />);
                break;
            case "settings":
                setSubMenu(<Settings />);
                break;
            default:
                setSubMenu(<Timeline />);
                break;
        }
    }

    const activeSubMenu = (current: subMenuType) => currentSubMenu == current ? "border-purplish text-purplish" : "border-transparent";

    return (
        <div className="flex bg-light-gray min-h-screen">
            <Sidebar current="explore" />
            <div className="h-min-screen w-full flex flex-col">
                <div className="w-full h-fit bg-whitish pt-5 px-10 border-b border-gray-200 shadow-xs">
                    <div className='max-w-360 mx-auto'>
                        <Header />

                        <div className="my-5 flex items-center justify-between">
                            <div>
                                <div className="flex-centering gap-x-2">
                                    <h1 className="text-4xl font-bold mb-2">Beer Logo Design</h1>
                                    <span className="badge-style bg-light-green">Research</span>
                                </div>
                                <p className="text-gray-600 text-xs">By <span className='underline text-sm'>Andreas Bunchaco</span></p>
                            </div>
                            <div className="flex-centering gap-x-2">
                                <button className="button-style-tertiary"><Heart strokeWidth="3" className="w-4 h-4 text-purplish" /></button>
                                <button className="button-style-tertiary"><Bookmark strokeWidth="3" className="w-4 h-4 text-purplish" /></button>
                                <button className="button-style">Follow <span className='underline text-sm'>Andreas Bunchaco</span></button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <ul className="list-none text-gray-600 text-sm mt-2 flex items-center">
                                <li onClick={() => changeSubMenu('timeline')} className={`detail-list-style ${activeSubMenu('timeline')}`}>Timeline</li>
                                <li onClick={() => changeSubMenu('overview')} className={`detail-list-style ${activeSubMenu('overview')}`}>Overview</li>
                                <li onClick={() => changeSubMenu('comments')} className={`detail-list-style ${activeSubMenu('comments')}`}>Comment</li>
                                <li onClick={() => changeSubMenu('settings')} className={`detail-list-style ${activeSubMenu('settings')}`}>Settings</li>
                            </ul>
                            <div className="flex items-center gap-x-5 text-purple-dark/60 text-sm mt-2 pb-3">
                                <p className="text-xs font-light">
                                    Published on <span className="ml-2 text-md font-medium">20 January 2025</span>
                                </p>
                                <p className="text-xs font-light">
                                    Last updated on <span className="ml-2 text-md font-medium">20 January 2025</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full h-fit bg-light-gray border-b border-gray-200 shadow-xs flex-1">
                    {subMenu}
                </div>
            </div>
        </div>
    )
}