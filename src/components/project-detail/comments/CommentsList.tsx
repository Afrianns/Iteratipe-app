import Image from "next/image";

export default async function CommentsList() {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    await delay(3000);
    setTimeout(() => {
        console.log("Waiting...")
    }, 10000)
    
    return (
        <div className="flex items-start gap-x-5 justify-start w-fill">
            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                <Image alt="user profile placeholder" src="/images/comment-placeholder.jpg" fill className="object-cover"/>
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                        <h3 className="text-md font-medium underline hover:no-underline cursor-pointer">Andreas Bunchaco</h3>
                        <span className="badge-style bg-grayish">Author</span>
                    </div>

                    <span className="span-style">2 days ago</span>
                </div>
                <p className="p-style w-4/5">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel non aperiam inventore aut vero! Ratione, similique totam?</p>
            </div>
        </div>
    )
}