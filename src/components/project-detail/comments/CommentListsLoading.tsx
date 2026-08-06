export const CommentsLoading = () => {
    const counts: number[] = [1,2,3]
    return (
        <>
            {counts.map((count: number) => (
                <div key={count} className="flex items-start gap-x-5 justify-start w-fill animate-pulse">
                    <div className="w-10 h-10 bg-slate-200 rounded-full shrink-0" />
                    
                    <div className="space-y-3 flex-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-x-2">
                                <div className="h-5 w-32 bg-slate-200 rounded" />
                                <div className="h-5 w-14 bg-slate-200 rounded-full" />
                            </div>

                            <div className="h-4 w-16 bg-slate-200 rounded" />
                        </div>
                        
                        <div className="space-y-2 w-4/5">
                            <div className="h-4 w-full bg-slate-200 rounded" />
                            <div className="h-4 w-5/6 bg-slate-200 rounded" />
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}