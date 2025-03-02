-- CreateTable
CREATE TABLE "follows" (
    "user_following_id" TEXT NOT NULL,
    "user_followed_by_id" TEXT NOT NULL,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("user_following_id","user_followed_by_id")
);

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_user_following_id_fkey" FOREIGN KEY ("user_following_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_user_followed_by_id_fkey" FOREIGN KEY ("user_followed_by_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
