export default async function ProjectTitle() {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(3000);

    return (
        <>
            <h1 className="text-4xl font-bold mb-2">Beer Logo Design</h1>
            <span className="badge-style bg-light-green">Research</span>
        </>
    )
}