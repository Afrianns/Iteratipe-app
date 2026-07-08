
import { SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";

export default async function AboutDesigner() {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    await delay(3000);
    setTimeout(() => {
        console.log("Waiting...")
    }, 10000)
    return (
        <>
            <div className="flex justify-between items-center">
                <h3 className="h-three-style">About Designer</h3>
                <SquareArrowOutUpRight className="icon-style-secondary" /> 
            </div>
            <div className="flex items-start gap-x-5">
                <Image alt="profile placeholder" src="/images/profile-placeholder.jpg" width={50} height={50} className="rounded-full"/>
                <div className="space-y-2">
                    <h3 className="text-lg font-medium underline hover:no-underline cursor-pointer">Andreas Bunchaco</h3>
                    <div className="flex gap-x-2 text-sm">
                        <p><span className="font-medium">5</span> Following</p>
                        <p><span className="font-medium">43</span> Followers</p>
                    </div>
                    <p className="p-style">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel non aperiam inventore aut vero! Ratione, similique totam?</p>
                </div>
            </div>
        </>
    )
}