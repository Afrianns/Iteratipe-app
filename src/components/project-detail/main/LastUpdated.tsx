
export default async function LastUpdated() {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(3000);

    return (
        <span className="ml-2 text-md font-medium">20 January 2025</span>
    )
}