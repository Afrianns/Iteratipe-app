import { prisma } from "@/lib/db";

export default async function getTagsFn() {
    const tags = await prisma.tags.findMany();
    return tags;
}