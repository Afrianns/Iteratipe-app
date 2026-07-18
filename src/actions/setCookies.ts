"use server"

import { cookies } from "next/headers";

export const openSidebarFn = async () => {
    const cookieStore = await cookies()
    const isOpen = cookieStore.get('sidebar_collapsed')?.value === 'true'

    cookieStore.set("sidebar_collapsed", String(!isOpen));
}   