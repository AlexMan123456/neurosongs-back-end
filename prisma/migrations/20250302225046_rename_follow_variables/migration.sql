/*
  Warnings:

  - The primary key for the `follows` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_followed_by_id` on the `follows` table. All the data in the column will be lost.
  - You are about to drop the column `user_following_id` on the `follows` table. All the data in the column will be lost.
  - Added the required column `followed_by_id` to the `follows` table without a default value. This is not possible if the table is not empty.
  - Added the required column `following_id` to the `follows` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "follows" DROP CONSTRAINT "follows_user_followed_by_id_fkey";

-- DropForeignKey
ALTER TABLE "follows" DROP CONSTRAINT "follows_user_following_id_fkey";

-- AlterTable
ALTER TABLE "follows" DROP CONSTRAINT "follows_pkey",
DROP COLUMN "user_followed_by_id",
DROP COLUMN "user_following_id",
ADD COLUMN     "followed_by_id" TEXT NOT NULL,
ADD COLUMN     "following_id" TEXT NOT NULL,
ADD CONSTRAINT "follows_pkey" PRIMARY KEY ("following_id", "followed_by_id");

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followed_by_id_fkey" FOREIGN KEY ("followed_by_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
