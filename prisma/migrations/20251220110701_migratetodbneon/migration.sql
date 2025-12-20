/*
  Warnings:

  - The primary key for the `_replytoreply` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_replytoreply` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "_replytoreply" DROP CONSTRAINT "_replytoreply_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_replytoreply_AB_unique" ON "_replytoreply"("A", "B");
