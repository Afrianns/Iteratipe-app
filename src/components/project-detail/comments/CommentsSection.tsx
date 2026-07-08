import CommentsDropdown from "./CommentsDropdown";

export default async function CommentsSection() {

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    await delay(3000);
    setTimeout(() => {
        console.log("Waiting...")
    }, 10000)

    return (
        <>
        <CommentsDropdown>
            <ul className="space-y-3">
                <li className="hover:bg-light-purple cursor-pointer py-1 px-3 rounded">All</li>
                <li className="hover:bg-light-purple cursor-pointer py-1 px-3 rounded">First Step</li>
                <li className="hover:bg-light-purple cursor-pointer py-1 px-3 rounded">Second Step</li>
            </ul>
        </CommentsDropdown>
        </>
    )
}