export default async function Summary() {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    await delay(3000);
    setTimeout(() => {
        console.log("Waiting...")
    }, 10000)
    return (
        <div className="card-style-secondary col-span-2">
            <h3 className="h-three-style">Project Summary</h3>
            <p className="p-style pb-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam temporibus voluptas, inventore, dolores repudiandae quibusdam sit aliquid maxime corrupti eveniet, vitae a ullam officia ducimus nulla autem. Quia, doloremque minus!</p>
            <hr className="h-style text-purple-dark/20" />
            <div className="flex items-center gap-x-3 justify-between pt-3">
                <h4 className="text-md">Project Durations</h4>
                <p className="text-sm text-purple-dark/70 flex items-center gap-x-3">
                    <span>1 January 2025</span> - 
                    <span>23 April 2025</span>
                </p>
            </div>
        </div>
    )
}