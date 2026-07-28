
export default function LastUpdated({updated_at}: {updated_at: Date}) {
    return (
        <span className="ml-2 text-md font-medium">{updated_at.toDateString()}</span>
    )
}