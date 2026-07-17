import { prisma } from "@/lib/db";

export default async function getToolsFn() {
    const tools = await prisma.tools.findMany();
    return tools;
}