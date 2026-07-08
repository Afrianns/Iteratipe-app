export default async function AuthorName() {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(3000);

    return (
        <span className='underline text-sm'>Andreas Bunchaco</span>
    )
}