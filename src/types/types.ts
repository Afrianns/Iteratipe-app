import { Connection, Edge, EdgeChange, Node, NodeChange } from "@xyflow/react";
import { handleEnum, modeEnum } from "./enum";

type setNode<T> = T | T[]

interface TimelineStateType {
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

interface nodeDataEditType {
  title: string
  type: string
  startDate: string
  endDate: string
  content: string
}

interface timelineNodeType extends Omit<Node, "data">{
  data: timelineNodeDataType
}

interface timelineNodeDataType {
    handleType?: handleEnum
    title?: string
    type?: string
    start_at?: string
    end_at?: string
    content?: string
    [key: string]: unknown;
}


interface PagePropsType {
  searchParams: Promise<{ menu?: string | undefined, tab?: string | undefined, node?: string | undefined }>;
}

interface initialStateType {
    success: boolean
    message: { title?: string[], type?: string[], content?: string[], start_at?: string[], end_at?: string[]}
}

type ToolsType = {
    id: number,
    name: string,
    logo?: string
}

type InputSelectPropsType = {
  start_at: Date | null,
  end_at: Date | null,
  className?: string;
  value?: string;
  onClick?: () => void;
};


type TagsType = string[]


type subMenuType = "timeline" | "overview" | "comments" | "settings";

export type {TimelineStateType, subMenuType, timelineNodeType, timelineNodeDataType, initialStateType, InputSelectPropsType, nodeDataEditType, setNode, PagePropsType, TagsType, ToolsType}