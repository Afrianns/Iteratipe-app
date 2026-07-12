"use server"
import '@xyflow/react/dist/style.css';

import Header from "../Header";
import Sidebar from "../Sidebar";
import { Bookmark, Heart } from 'lucide-react';
import Timeline from './Timeline';
import Overview from './Overview';
import Comments from './Comments';
import Settings from './Settings';
import DetailMenu from '@/components/project-detail/main/DetailMenu';
import { PagePropsType } from '@/types/types';
import { Suspense } from 'react';
import Published from './main/Published';
import LastUpdated from './main/LastUpdated';
import ProjectTitle from './main/ProjectTitle';
import AuthorName from './main/AuthorName';


export default async function Main({searchParams}: PagePropsType) {

    const params = await searchParams;

    let subMenu = <Timeline params={params} />;

    const changeSubMenuFn = (menu: string) => {
        switch (menu) {
            case "timeline":
                subMenu = <Timeline params={params} />
                break;
            case "overview":
                subMenu = <Overview />
                break;
            case "comments":
                subMenu = <Comments />
                break;
            case "settings":
                subMenu = <Settings params={params} />
                break;        
            default:
                subMenu = <Timeline params={params} />
                break;
        }
    }

    if(params?.menu != undefined) changeSubMenuFn(params?.menu)

    let key = `${params.menu || "empty-tl"}-${params.node|| "empty-nd"}-${params.tab || "empty-tb"}`
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
                                    <Suspense key={key} fallback={<ProjectTitleLoading />}>
                                        <ProjectTitle />
                                    </Suspense>
                                </div>
                                <p className="text-gray-600 text-xs mt-1.5 flex items-center gap-x-1">
                                    <span>By</span>
                                    <Suspense key={key} fallback={<span className="block h-4 w-25 bg-slate-200 animate-pulse rounded"></span>}>
                                        <AuthorName />
                                    </Suspense>
                                </p>
                            </div>
                            <div className="flex-centering gap-x-2">
                                <button className="button-style-tertiary"><Heart strokeWidth="3" className="w-4 h-4 text-purplish" /></button>
                                <button className="button-style-tertiary"><Bookmark strokeWidth="3" className="w-4 h-4 text-purplish" /></button>
                                <button className="button-style">Follow <span className='underline text-sm'>Andreas Bunchaco</span></button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <DetailMenu />
                            <div className="flex items-center gap-x-5 text-purple-dark/60 text-sm mt-2 pb-3">
                                <p className="text-xs font-light flex items-center gap-x-2">
                                    Published on 
                                    <Suspense key={key} fallback={<span className="inline-block h-4 w-25 bg-slate-200 animate-pulse rounded"></span>}>
                                        <Published />
                                    </Suspense>
                                </p>
                                <p className="text-xs font-light flex items-center gap-x-2">
                                    Last updated on 
                                    <Suspense key={key} fallback={<span className="inline-block h-4 w-25 bg-slate-200 animate-pulse rounded"></span>}>
                                        <LastUpdated />
                                    </Suspense>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full h-fit bg-light-gray border-b border-gray-200 shadow-xs flex-1">
                    {subMenu}
                    <div id="date-picker-root"></div>
                </div>
            </div>
        </div>
    )
}


const ProjectTitleLoading = () => {
    return (
        <div className="flex items-center gap-x-2 w-80">
            <div className="h-10 w-70 bg-slate-200 rounded" />
            <div className="h-5 w-15 bg-slate-200 rounded-full" />
        </div>
    )
}