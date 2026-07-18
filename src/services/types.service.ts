import { prisma } from "@/lib/db";

export default async function getTypesFn() {
    const types = await prisma.types.findMany();
    return types;
}