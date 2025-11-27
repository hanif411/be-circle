-- CreateTable
CREATE TABLE "_replytoreply" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_replytoreply_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_replytoreply_B_index" ON "_replytoreply"("B");

-- AddForeignKey
ALTER TABLE "_replytoreply" ADD CONSTRAINT "_replytoreply_A_fkey" FOREIGN KEY ("A") REFERENCES "replies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_replytoreply" ADD CONSTRAINT "_replytoreply_B_fkey" FOREIGN KEY ("B") REFERENCES "replies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
