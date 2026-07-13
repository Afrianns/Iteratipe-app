import { subMenuEnum } from '@/types/enum';
import { create } from 'zustand'

interface generalType {
    name: string,
    summary: string,
    type: string,
    tags: string[],
    tools: string[],
}

interface visibilityType {
    type: string,
    comment: boolean,
    client: string
}

export const useInitialProjectStore = create<any>((set) => ({
    general: {
        name: 'jacksons',
        summary: 'kacosn is not very good at that',
        status: 'super',
        tags: [],
        tools: [],
    },
    visibility: {
        type: '',
        comment: false,
        client: ''
    },
    setField: (key: string, value: string) => set((state: generalType) => ({
        general: { [key]: value, ...state }
    })),
    setGeneral: (generalData: generalType) => set({ 
        general: {
            name: generalData.name,
            summary: generalData.summary,
            type: generalData.type,
            tags: generalData.tags,
            tools: generalData.tools,
        }
    }),
    setVisibility: (visibilityData: visibilityType) => set({ 
        visibility: {
            type: visibilityData.type,
            comment: visibilityData.comment,
            client: visibilityData.client
        }
    }),
}));