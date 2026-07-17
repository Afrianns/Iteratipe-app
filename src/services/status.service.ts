import { prisma } from "@/lib/db";

export default async function getStatusFn() {
    const status = await prisma.status.findMany()
    return status;
}