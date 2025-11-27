/*
  Warnings:

  - Made the column `created_by` on table `threads` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "threads" DROP CONSTRAINT "threads_created_by_fkey";

-- AlterTable
ALTER TABLE "threads" ALTER COLUMN "created_by" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "threads" ADD CONSTRAINT "threads_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
