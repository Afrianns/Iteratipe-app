
export default function ListToolsSetting() {

    // const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // await delay(3000);
    // setTimeout(() => {
    //     console.log("Waiting...")
    // }, 10000)

    const tags = ["Illustration", "Photoshop", "Figma", "Procreate"]

    return (
        <div className="flex items-center gap-x-2">
            {tags.map((tag, idx) => <span key={idx} className="badge-style-secondary">{tag}</span>)}
        </div>
    )
}