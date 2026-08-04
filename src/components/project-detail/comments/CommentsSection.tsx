import CommentsDropdown from "./CommentsDropdown";

export default function CommentsSection() {
    return (
        <>
        <CommentsDropdown>
            <ul className="space-y-3">
                <li className="hover:bg-light-gray cursor-pointer py-2 px-4">All</li>
                <li className="hover:bg-light-gray cursor-pointer py-2 px-4">First Step</li>
                <li className="hover:bg-light-gray cursor-pointer py-2 px-4">Second Step</li>
            </ul>
        </CommentsDropdown>
        </>
    )
}