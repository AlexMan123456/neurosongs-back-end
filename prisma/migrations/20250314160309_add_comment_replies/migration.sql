-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "replying_to_id" INTEGER;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_replying_to_id_fkey" FOREIGN KEY ("replying_to_id") REFERENCES "comments"("comment_id") ON DELETE SET NULL ON UPDATE CASCADE;
