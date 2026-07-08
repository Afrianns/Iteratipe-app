import { Connection, Edge, EdgeChange, Node, NodeChange } from "@xyflow/react";
import { modeEnum } from "./enum";

interface TimelineStateType {
  mode: modeEnum;
  isFirstNodeUsed: boolean,
  isEndNodeUsed: boolean,
  MainNodeLeft: number,
  Nodes: Node[] | [],
  Edges: Edge[] | [],
  setNodesChange: (changes: NodeChange[]) => void,
  setEdgesChange: (changes: EdgeChange[]) => void,
  setConnection: (connection: Connection) => void,
  setNodes: (node: Node) => void,
  deleteNode: (nodeId: string) => void,
  changeMode: (mode: modeEnum) => void,
  setFirstNode: (first: boolean) => void,
  setEndNode: (end: boolean) => void
}

interface PagePropsType {
  searchParams: Promise<{ menu?: string | undefined }>;
}

type ToolsType = {
    id: number,
    name: string,
    logo?: string
}

type TagsType = string[]


type subMenuType = "timeline" | "overview" | "comments" | "settings";

export type {TimelineStateType, subMenuType, PagePropsType, TagsType, ToolsType}