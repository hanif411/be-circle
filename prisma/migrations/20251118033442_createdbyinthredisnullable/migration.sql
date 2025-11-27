-- DropForeignKey
ALTER TABLE "threads" DROP CONSTRAINT "threads_created_by_fkey";

-- AlterTable
ALTER TABLE "threads" ALTER COLUMN "created_by" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "threads" ADD CONSTRAINT "threads_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
