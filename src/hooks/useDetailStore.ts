import { subMenuEnum } from '@/types/enum';
import { create } from 'zustand'

export const useDetailStore = create<any>((set) => ({
    subMenu: subMenuEnum.OVERVIEW,
    changeSubMenu: (subMenu: subMenuEnum) => set({ subMenu: subMenu}),
}));