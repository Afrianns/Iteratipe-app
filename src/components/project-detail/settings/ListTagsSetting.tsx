import TagsSetting from "./TagsSetting";

export default async function ListTagsSetting() {

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(3000);

    const tags = ["Logo", "Design", "Branding"]

    return (
        <div className="flex items-center gap-x-2">
            <TagsSetting tags={tags} />
        </div>
    )
}