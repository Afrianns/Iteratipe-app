
export default function ListToolsSetting() {

    const tags = ["Illustration", "Photoshop", "Figma", "Procreate"]

    return (
        <div className="flex items-center gap-x-2">
            {tags.map((tag, idx) => <span key={idx} className="badge-style-secondary">{tag}</span>)}
        </div>
    )
}