
import { getPreviewUser } from "@/services/user.service";
import { UserPreviewType } from "@/types/types";
import { SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export default async function AboutDesigner({designerId}: {designerId: number}) {

    let initialUser: UserPreviewType | null = {
        id: 0,
        clerk_user_id: "",
        first_name: "",
        last_name: "",
        image_url: "",
        description: "",
    }
    
    const user = await getPreviewUser(designerId)
    
    if(user.status == 200){
        initialUser = user.data as UserPreviewType
    }
    return (
        <>
            <div className="flex justify-between items-center">
                <h3 className="h-three-style">About Designer</h3>
                <Link href={"#"}>
                    <SquareArrowOutUpRight className="icon-style-secondary" /> 
                </Link>
            </div>
            <div className="flex items-start gap-x-5">
                <Image alt="profile placeholder" src={initialUser.image_url} width={50} height={50} className="rounded-full"/>
                <div className="space-y-2">
                    <h3 className="text-lg font-medium underline hover:no-underline cursor-pointer">{initialUser.first_name} {initialUser.last_name}</h3>
                    <div className="flex gap-x-2 text-sm">
                        <p><span className="font-medium">5</span> Following</p>
                        <p><span className="font-medium">43</span> Followers</p>
                    </div>
                    <p className="p-style">{initialUser.description || <span className="text-purple-dark/50 italic">Hi there, I'am passionate about designing thing...</span>}</p>
                </div>
            </div>
        </>
    )
}