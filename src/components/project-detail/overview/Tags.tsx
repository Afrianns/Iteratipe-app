import { TagsType } from "@/types/types";
import TagsList from "./TagsList";

interface TagsInterface { tags: TagsType }

export default async function Tags({tags}: TagsInterface) {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    await delay(3000);
    setTimeout(() => {
        console.log("Waiting...")
    }, 10000)
   
    return (
        <>
            <h3 className="h-three-style z-2 relative">Tags</h3> 
            <TagsList tags={tags} />
        </>
    )
}