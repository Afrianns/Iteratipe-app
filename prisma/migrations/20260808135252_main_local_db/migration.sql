-- AlterTable
ALTER TABLE "Nodes" ALTER COLUMN "uid" SET DEFAULT gen_ulid()::uuid;
