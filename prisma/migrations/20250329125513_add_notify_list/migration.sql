-- CreateTable
CREATE TABLE "notify_list" (
    "user_id" TEXT NOT NULL,
    "comment_id" INTEGER NOT NULL,

    CONSTRAINT "notify_list_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "notify_list" ADD CONSTRAINT "notify_list_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notify_list" ADD CONSTRAINT "notify_list_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("comment_id") ON DELETE CASCADE ON UPDATE CASCADE;
