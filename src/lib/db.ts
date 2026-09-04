import { PrismaClient } from "@/generated/prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaNeon } from "@prisma/adapter-neon";

import 'dotenv/config'

const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
})
// Initialize the adapter according to your driver's requirements
// const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
// Pass the adapter instance to PrismaClient

const prisma = new PrismaClient({ adapter })

const globalForPrisma = global as unknown as { prisma: typeof prisma }

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }