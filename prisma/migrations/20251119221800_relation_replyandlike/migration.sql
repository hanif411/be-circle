-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_thread_id_fkey";

-- AlterTable
ALTER TABLE "likes" ADD COLUMN     "reply_id" INTEGER,
ALTER COLUMN "thread_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "threads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_reply_id_fkey" FOREIGN KEY ("reply_id") REFERENCES "replies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
