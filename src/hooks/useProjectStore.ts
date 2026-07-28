import { getProjectDetailById } from '@/services/projects.service';
import { ProjectType } from '@/types/types';
import { create } from 'zustand'

export const useProjectStore = create<any>((set, get) => ({
    project: {
        id: 0,
        created_at: "",
        uid: "",
        user_id: 0,
        type_id: 0,
        title: "",
        summary: "",
        visibility: "PUBLIC",
        disable_comments: false,
        client_name: "",
        updated_at: "",
        status_id: 0,
        Status: {},
        Type: {},
        Users: {
            id: 0,
            full_name: "",
            clerk_user_id: ""
        }
    },
    visibility: {
        type: '',
        comment: false,
        client: ''
    },

    getPopulateProject: async (id: string = "the-working-bitches-is-here%E2%80%94b0b29eef-5aa3-4f98-b23b-dbeda0d362a0"): Promise<{
        status: number
        message: string
        data?: ProjectType 
    }> => {
    
        const getInitialProject = async () => {
            try {
                const result = await getProjectDetailById(id.split("%E2%80%94")[1])
                
                if(result.status == 200 && result.data){
                    set(result.data)
                    return {
                        status: 200,
                        message: "Successfuly"
                    }
                } else{
                    throw new Error("An error occur")
                }
            } catch (error) {
                return {
                    status: 500,
                    message: "An error occur"
                }
            }
        }
        
        if(get().project.id <= 0 && get().project.uid.length <= 0){
            let result = await getInitialProject()

            console.log(result)

            if(result.status == 200){
                return {
                    status: 200,
                    message: "Successfuly",
                    data: get().project
                }
            }

        } 

        // console.log()

        return {
            status: 200,
            message: "Successfuly",
            data: get().project
        }
    },
}));