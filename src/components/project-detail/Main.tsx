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
import { PagePropsType, WithPivotDataType } from '@/types/types';
import { Suspense } from 'react';
import Published from './main/Published';
import LastUpdated from './main/LastUpdated';
import ProjectTitle from './main/ProjectTitle';
import AuthorName from './main/AuthorName';


interface MainType extends PagePropsType {
    project: WithPivotDataType
    searchParams: Promise<{ menu?: string | undefined; tab?: string | undefined; node?: string | undefined; }>
}

export default async function Main({searchParams, project}: MainType) {

    const searchParam = await searchParams


    let projectTitleInfo = {
        title: project.title,
        Type: project.Type,
    }

    const initialData = {
        summary: project.summary,
        type: project.Type,
        client_name: project.client_name,
        tags: project.Project_tags,
        tools: project.Project_tools,
    }

    let overviewDataInfo = {
        id: project.id,
        user: project.Users,
        ...initialData
    }
    
    let settingData = {
        tab: searchParam.tab,
        data: {
            id: project.id,
            title: project.title,
            status: project.Status,
            visibility: project.visibility,
            disable_comments: project.disable_comments,
            ...initialData
        }
    }

    let subMenu = <Timeline params={searchParam} />;

    const changeSubMenuFn = (menu: string) => {
        switch (menu) {
            case "timeline":
                subMenu = <Timeline params={searchParam} />
                break;
            case "overview":
                subMenu = <Overview overview={overviewDataInfo} />
                break;
            case "comments":
                subMenu = <Comments />
                break;
            case "settings":
                subMenu = <Settings setting={settingData} />
                break;        
            default:
                subMenu = <Timeline params={searchParam} />
                break;
        }
    }

    if(searchParam?.menu != undefined) changeSubMenuFn(searchParam?.menu)

    let key = `${searchParam.menu || "empty-tl"}-${searchParam.node|| "empty-nd"}-${searchParam.tab || "empty-tb"}`
    return (
        <div className="container-wrapper-style">
            <Sidebar />
            <div className="h-min-screen w-full flex flex-col">
                <div className="container-style container-accent-style mb-0! pb-0!">
                    <div className='limit-breaker'>
                        <Header showSearch={false} />
                        <div className="my-5 flex max-lg:flex-col gap-y-5 items-center justify-between">
                            <div className='mr-auto'>
                                <div className="flex-centering gap-x-2">
                                    <Suspense key={key} fallback={<ProjectTitleLoading />}>
                                        <ProjectTitle data={projectTitleInfo} />
                                    </Suspense>
                                </div>
                                <p className="text-gray-600 text-xs mt-1.5 flex items-center gap-x-1">
                                    <span>By</span>
                                    <Suspense key={key} fallback={<span className="block h-4 w-25 bg-slate-200 animate-pulse rounded"></span>}>
                                        <AuthorName full_name={project.Users?.full_name} />
                                    </Suspense>
                                </p>
                            </div>
                            <div className="flex-centering gap-x-2 ml-auto">
                                <button className="button-style-tertiary"><Heart strokeWidth="3" className="w-4 h-4 text-purplish" /></button>
                                <button className="button-style-tertiary"><Bookmark strokeWidth="3" className="w-4 h-4 text-purplish" /></button>
                                <button className="button-style">Follow <span className='underline text-sm'>Andreas Bunchaco</span></button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between max-lg:flex-col-reverse">
                            <DetailMenu />
                            <div className="flex items-center gap-x-5 text-purple-dark/60 text-sm mt-2 pb-3">
                                <p className="text-xs font-light flex items-center gap-x-2">
                                    Published on 
                                    <Suspense key={key} fallback={<span className="inline-block h-4 w-25 bg-slate-200 animate-pulse rounded"></span>}>
                                        <Published created_at={project.created_at || new Date()} />
                                    </Suspense>
                                </p>
                                <p className="text-xs font-light flex items-center gap-x-2">
                                    Last updated on 
                                    <Suspense key={key} fallback={<span className="inline-block h-4 w-25 bg-slate-200 animate-pulse rounded"></span>}>
                                        <LastUpdated updated_at={project.updated_at || new Date()} />
                                    </Suspense>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full h-fit bg-light-gray border-b border-gray-200 shadow-xs flex-1 max-md:mb-20">
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