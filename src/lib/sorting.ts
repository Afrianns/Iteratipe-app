import { ProjectPreviewType, SortingType, StatusType } from "@/types/types"

export const sortingBy = (projects: ProjectPreviewType[], type: SortingType) => {
  return projects.sort((A, B) => (type == "ASC") ? new Date(A.created_at).getTime() - new Date(B.created_at).getTime() : new Date(B.created_at).getTime() - new Date(A.created_at).getTime())
}

export const getTypeAndSort = (projects: ProjectPreviewType[]) => {
  return projects.map((project) => ({id: project.Type.id, name: project.Type.name})).sort((a,b) => a.id - b.id)
}


export const filtering = (projects: ProjectPreviewType[], type: string, sortBy: SortingType, status: StatusType) => {
  // , status: "pending"|"in_progress"|"completed"
  let result = projects

  if(type != "All") result = projects.filter((projects) => projects.Type.name == type)
  
  console.log("hello --- ",status, result)

  if(status != "all") result = result.filter((project) => project.Status.name.toLowerCase() == status)
      
  result = sortingBy(result, sortBy)
  
  return result
}