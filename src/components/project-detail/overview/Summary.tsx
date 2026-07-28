export default function Summary({ summary, client_name }: {summary: string, client_name: string | null}) {
    return (
        <div className="card-style-secondary col-span-2 space-y-3">
            <h3 className="h-three-style">Project Summary</h3>
            <p className="p-style pb-3">{summary}</p>
            <hr className="h-style text-purple-dark/20" />
            <div className="flex items-center gap-x-3 justify-between pt-3">
                <h4 className="text-md">Project Durations</h4>
                <p className="text-sm text-purple-dark/70 flex items-center gap-x-3">
                    <span>1 January 2025</span> - 
                    <span>23 April 2025</span>
                </p>
            </div>
            {client_name &&
                <div className="flex items-center gap-x-3 justify-between pt-3">
                    <h4 className="text-md">Client Name</h4>
                    <p className="text-sm text-purple-dark/70 flex items-center gap-x-3">
                        {client_name}
                    </p>
                </div>
            }
        </div>
    )
}