"use client"

import { useClerk } from "@clerk/nextjs"

export const SignOut = () => {
    const { signOut } = useClerk()
    return (
        <div className="flex justify-center gap-x-5">
            <button type="button" onClick={() => signOut() } className="button-style-secondary bg-light-red/20! text-light-red! hover:bg-light-red/15! rounded-full">Sign Out</button>
        </div>
    )
}