import { Connection, Edge, EdgeChange, Node, NodeChange } from "@xyflow/react";
import { handleEnum, modeEnum } from "./enum";

export type setNode<T> = T | T[]

export interface TimelineStateType {
  mode: modeEnum;
  isFirstNodeUsed: boolean,
  isEndNodeUsed: boolean,
  isEditMode: boolean,
  MainNodeLeft: number,
  nodes: timelineNodeType[] | [],
  edges: Edge[] | [],
  showSidebar: boolean,
  nodeDataEdit: nodeDataEditType,
  setIsEditMode: () => void,
  setShowSidebar: () => void,
  setNodesChange: (changes: NodeChange[]) => void,
  setEdgesChange: (changes: EdgeChange[]) => void,
  setConnection: (connection: Connection) => void,
  setNodes: (nodes: setNode<timelineNodeType>) => void,
  setEdges: (edges: Edge[]) => void,
  deleteNode: (nodeId: string) => void,
  changeMode: (mode: modeEnum) => void,
  setFirstNode: (first: boolean) => void,
  setEndNode: (end: boolean) => void
}

export interface nodeDataEditType {
  title: string
  type: string
  startDate: string
  endDate: string
  content: string
}

export interface timelineNodeType extends Omit<Node, "data">{
  data: timelineNodeDataType
}

export interface timelineNodeDataType {
    handleType?: handleEnum
    title?: string
    type?: string
    start_at?: string
    end_at?: string
    content?: string
    [key: string]: unknown;
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
export type VISIBLE = "" | "PUBLIC" | "SEMI" | "PRIVATE"


export interface SetupType {
  name: string,
  summary: string,
  status: string,
  tags: string[],
  tools: string[],
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

export interface SetupErrorsType {
    name?: string[] | undefined
    summary?: string[] | undefined
    status?: string[] | undefined
    tags?: string[] | undefined
    tools?: string[] | undefined
}

export interface FormActionStateType {
    success: boolean
    next_step: Step
    step_one_fields?: SetupType
    step_one_errors?: SetupErrorsType
    step_two_fields?: VisibilityType
    step_two_errors?: VisibilityErrorsType
}

// tag and tools type
export interface labelType {
    id: number
    name: string
}


export type subMenuType = "timeline" | "overview" | "comments" | "settings";