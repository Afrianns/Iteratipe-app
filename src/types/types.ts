import { Connection, Edge, EdgeChange, Node, NodeChange } from "@xyflow/react";
import { handleEnum, modeEnum } from "./enum";
import { handleTypeEnum } from "@/generated/prisma/enums";
import { Decimal } from "@prisma/client/runtime/client";

export type setNode<T> = T | T[]

// tag and tools type
export interface labelType {
    id: number
    name: string
}

// timeline
export interface TimelineStateType {
  mode: modeEnum
  isStartNodeUsed: boolean
  isEndNodeUsed: boolean
  MainNodeLeft: number
  globalNodes: timelineNodeType[] | []
  globalEdges: Edge[] | []
  lastGlobalNodes: timelineNodeType[] | []
  lastGlobalEdges: Edge[] | []
  getNodeById: (id: string) => timelineNodeType | undefined
  updateDataNode: (id: string, nodes: nodeDataType) => void
  setGlobalNodes: (nodes: setNode<timelineNodeType>) => void
  setGlobalEdges: (edges: Edge[]) => void
  setLastGlobalNodes: (nodes: timelineNodeType[]) => void
  setLastGlobalEdges: (edges: Edge[]) => void
  deleteNode: (nodeId: string) => void
  deleteEdge: (edgeId: string) => void
  changeMode: (mode: modeEnum) => void
  setStartNode: (first: boolean) => void
  setEndNode: (end: boolean) => void
  resetTimeline: () => void
}

// project type
export interface ProjectType { 
  id: number
  created_at: Date
  uid: string
  user_id: number
  type_id: number
  title: string
  summary: string
  visibility: VISIBLE
  disable_comments: boolean
  client_name: string | null
  updated_at: Date | null
  status_id: number
  Status: labelType
  Type: labelType
  Users: {
    id: number
    full_name: string
    clerk_user_id: string
  }
  _count: {
    Nodes: number
  }
}

export interface WithPivotDataType extends ProjectType {
    Project_tags: labelType[]
    Project_tools: labelType[]
    Nodes: timelineNodeType[]
}


export interface nodeDataType {
  title: string
  type: string
  start_at: string
  end_at: string
  content: string
}

export interface timelineNodeType extends Omit<Node, "data">{
  data: timelineNodeDataType
}

export interface timelineNodeDataType extends nodeDataType {
    handleType: handleEnum
    [key: string]: unknown
}


export interface NodeDBType {
  title: string,
  thumbnail: string | null,
  type: string,
  start_date: string | null,
  end_date: string | null,
  content: string | null,
  position_x: number,
  position_y: number,
  handle_type: 'start' | "main" | "end",
  uid: string
}


export interface PagePropsType {
  searchParams: Promise<{ menu?: string | undefined, tab?: string | undefined, node?: string | undefined }>;
}

export interface initialStateType {
    success: boolean
    message: { title?: string[], type?: string[], content?: string[], start_at?: string[], end_at?: string[]}
}

// export type ToolsType = {
//     id: number,
//     name: string,
// }

export type InputSelectPropsType = {
  start_at: Date | null,
  end_at: Date | null,
  className?: string;
  value?: string;
  onClick?: () => void;
};

export type Step = "SETUP" | "VISIBILITY" | "SUMMARY"
export type VISIBLE = "PUBLIC" | "SEMI" | "PRIVATE"


// new type for settings

export interface generalDataType {
  id?: number
  title: string
  summary: string
  type: labelType
  status: labelType
  tags: labelType[]
  tools: labelType[]
  visibility: VISIBLE
  disable_comments: boolean
  client_name: string
} 

// end

export interface ProjectStoreType {
  title: string
  summary: string
  type: {id: number}
  status: {id: number}
  tags: {tag_id: number}[]
  tools: {tool_id: number}[]
  visibility: VISIBLE
  disable_comments: boolean
  client_name: string
}

export interface VisibilityType {
  visibility: VISIBLE,
  disable_comments: boolean,
  client_name: string
}

export interface VisibilityErrorsType {
  visibility?: string[] | undefined
  disable_comments?: string[] | undefined
  client_name?: string[] | undefined
}

export interface generalSettingErrorsType extends VisibilityErrorsType {
    title?: string[] | undefined
    summary?: string[] | undefined
    type?: string[] | undefined
    status?: string[] | undefined
    tags?: string[] | undefined
    tools?: string[] | undefined
}


// user type
export interface UserWebhookType {
    id: string
    first_name: string
    last_name: string
    full_name: string
    email: string
    image_url: string
}

// full user 
export interface UserType {
 id: number;
 clerk_user_id: string;
 first_name: string;
 last_name: string;
 full_name: string;
 email: string;
 image_url: string;
 description: string | null;
 facebook_link: string | null;
 twitter_link: string | null;
 website_link: string | null;
 created_at: Date | null;
}

export interface UserPreviewType {
  id: number;
  clerk_user_id: string
  first_name: string
  last_name: string
  image_url: string
  description: string | null
}



// return data type function for services

export interface returnDataType<T> {
    status: number
    message: string
    data?: T
}


// DB nodes return type

export type Tab = "general" | "visibility"

export interface DBSingleProjectByID {
  id: number
  projectTitleInfo: DBProjectTitleInfo
  overviewInfo: OverviewInfo
  settingInfo: DBSettingInfo
  Nodes: timelineNodeType[]
  Edges: Edge[]
  created_at: Date | null
  updated_at: Date | null
}

// export interface DBNodeType {
//     id: string,
//     thumbnail: string,
//     title: string,
//     type: string,
//     content: string,
//     end_at: string,
//     start_at: string,
//     handle_type: handleEnum,
//     position_x: number,
//     position_y: number,
//     updated_at: string,
//     published_at: string
// }

interface DBProjectTitleInfo {
    title: string
    type: labelType
}

interface OverviewInfo extends initialInfo{
  id: number
  user: {
    id: number
    full_name: string
    clerk_user_id: string
  }
}

interface initialInfo {
    summary: string
    type: labelType
    client_name: string | null
    tags: labelType[]
    tools: labelType[]
}

export interface DBSettingInfo {
    data: DBSettingInfoData
}


interface DBSettingInfoData extends initialInfo {
  id: number
  title: string
  status: labelType
  visibility: VISIBLE
  disable_comments: boolean
}


  // id: number
  // created_at: Date
  // uid: string
  // user_id: number
  // type_id: number
  // title: string
  // summary: string
  // visibility: VISIBLE
  // disable_comments: boolean
  // client_name: string | null
  // updated_at: Date | null
  // status_id: number
  // Status: labelType
  // Type: labelType
  // Users: {
  //   id: number
  //   full_name: string
  //   clerk_user_id: string
  // }

export type subMenuType = "timeline" | "overview" | "comments" | "settings";