"use client"

import '@xyflow/react/dist/style.css';

import Header from "../Header";
import { Bookmark, Heart } from 'lucide-react';
import Timeline from './Timeline';
import Overview from './Overview';
import Comments from './Comments';
import Settings from './Settings';
import DetailMenu from '@/components/project-detail/main/DetailMenu';
import { DBSingleProjectByID, generalDataType, generalSettingErrorsType, PagePropsType, timelineNodeDataType, timelineNodeType, VISIBLE } from '@/types/types';
import { Suspense, useEffect, useState } from 'react';
import Published from './main/Published';
import LastUpdated from './main/LastUpdated';
import ProjectTitle from './main/ProjectTitle';
import AuthorName from './main/AuthorName';
import { convertDate } from '@/lib/convertDate';
import { useSearchParams } from 'next/navigation';
import { getProjectDetailById } from '@/services/projects.service';
import { useTimelineStateStore } from '@/hooks/useTimelineStateStore';
import { SettingContext } from '@/lib/settingContext';


const MENU = ["timeline", "overview", "settings", "comments"]
let initialProjectTitleInfo = {
    title: "",
    type: {
        id: 0,
        name: ""
    }
}

const initialData = {
    summary: "",
    type: {
        id: 0,
        name: ""
    },
    client_name: "",
    tags: [],
    tools: [],
}

let initialOverviewDataInfo = {
    id: 0,
    user: {
        id: 0,
        full_name: "",
        clerk_user_id: ""
    },
    ...initialData
}

let initialSettingData = {
    data: {
        id: 0,
        title: "",
        status: {
            id: 0,
            name: ""
        },
        visibility: 'PUBLIC' as VISIBLE,
        disable_comments: false,
        ...initialData
    }
}


let settings = {
    id: 0,
    title: "",
    summary: "",
    type: {
        id: 0,
        name: ""
    },
    status: {
        id: 0,
        name: ""
    },
    tags: [],
    tools: [],
    visibility: "PUBLIC" as VISIBLE,
    disable_comments: false,
    client_name: "",
}

export default function Main({ projectID }: {projectID: string}) {

    const { resetTimeline, setGlobalNodes, setLastGlobalNodes, setStartNode, setEndNode } = useTimelineStateStore()
    const [generalSettingErrors, setGeneralSettingErrors] = useState<generalSettingErrorsType>({})
    const [generalSettings, setGeneralSettings] = useState<generalDataType>(settings)

    const [project, setProject] = useState<DBSingleProjectByID>({
        projectTitleInfo: initialProjectTitleInfo,
        overviewInfo: initialOverviewDataInfo,
        settingInfo: initialSettingData,
        Nodes: [],
        created_at: null,
        updated_at: null
    })

    useEffect(() => {
        const getProjectByID = async () => {
            const result = await getProjectDetailById(projectID.split("%E2%80%94")[1])
            if(result.status == 200 && result.data){
                setProject(result.data) 
                return result.data
            }
        } 
        
        const setTimelineData = (nodes: timelineNodeType[]) => {
            let containEND = false
            let containSTART = false
            
            for (const key in nodes) {
                if (nodes[key].data.handleType == "end") containEND = true
                if (nodes[key].data.handleType == "start") containSTART = true
                
                if(containEND && containSTART) break
            }
            
            resetTimeline()
            setStartandEndNode(containSTART, containEND, true)
            
            console.log("get called many times?", project)
            setGlobalNodes(nodes)
            setLastGlobalNodes(nodes)
        }

        getProjectByID().then((project) => {
            const settings = project?.settingInfo 
            const nodes = project?.Nodes
            if(nodes) setTimelineData(nodes)

            if(settings) {
                setGeneralSettings({
                    id: settings.data.id,
                    title: settings.data.title,
                    summary: settings.data.summary,
                    type: settings.data.type,
                    status: settings.data.status,
                    tags: settings.data.tags,
                    tools: settings.data.tools,
                    visibility: settings.data.visibility,
                    disable_comments: settings.data.disable_comments,
                    client_name: settings.data.client_name || "",
                })
            }
        })
        
    }, [])


    const searchParam = useSearchParams();
    const menu = searchParam.get("menu");

    if(menu && !MENU.includes(menu)) {
        return <div>
            <h1>Ooops....Seem like that menu doesn't exist :\</h1>
        </div>
    }

    const setStartandEndNode = (startCodition: boolean, endCodition: boolean, resultCondition: boolean) => {
        if(startCodition) setStartNode(resultCondition)
        if(endCodition) setEndNode(resultCondition)
    }

    return (
        <>
            <div className="h-min-screen w-full flex flex-col">
                <div className="container-style container-accent-style mb-0! pb-0!">
                    <div className='limit-breaker'>
                        <Header showSearch={false} />
                        <div className="my-5 flex max-lg:flex-col gap-y-5 items-center justify-between">
                            <div className='mr-auto'>
                                <div className="flex-centering gap-x-2">
                                    {project.projectTitleInfo.title ?
                                        <ProjectTitle data={project.projectTitleInfo} />
                                    :
                                        <ProjectTitleLoading />
                                    }
                                </div>
                                <p className="text-gray-600 text-xs mt-1.5 flex items-center gap-x-1">
                                    <span>By</span>
                                    {project.overviewInfo.user.full_name ? 
                                        <AuthorName full_name={project.overviewInfo.user.full_name} />
                                    :
                                        <span className="block h-4 w-25 bg-slate-200 animate-pulse rounded"></span>
                                    }
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
                                    {project.created_at ?
                                        <Published created_at={project.created_at} />
                                    :
                                        <span className="inline-block h-4 w-25 bg-slate-200 animate-pulse rounded"></span>
                                    }
                                </p>
                                <p className="text-xs font-light flex items-center gap-x-2">
                                    Last updated on 
                                    {project.created_at ? 
                                        <LastUpdated updated_at={project.updated_at || new Date()} />
                                    :
                                        <span className="inline-block h-4 w-25 bg-slate-200 animate-pulse rounded"></span>
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full h-fit bg-light-gray border-b border-gray-200 shadow-xs flex-1 max-md:mb-20">
                    <div className={`contents ${(menu === "timeline" || !menu) ? "block" : "hidden"}`}>
                        <Timeline />
                    </div>

                    <div className={menu === "overview" ? "block" : "hidden"}>
                        <Overview overview={project.overviewInfo} />
                    </div>

                    <div className={menu === "comments" ? "block" : "hidden"}>
                        <Comments />
                    </div>

                    <div className={menu === "settings" ? "block" : "hidden"}>
                        <SettingContext.Provider value={{ generalSettings: generalSettings, setGeneralSettings: setGeneralSettings, generalSettingErrors: generalSettingErrors, setGeneralSettingErrors: setGeneralSettingErrors }}>
                            <Settings />
                        </SettingContext.Provider>
                    </div>
                    <div id="date-picker-root"></div>
                </div>
            </div>
        </>
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