/*
  Warnings:

  - The primary key for the `follows` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `followed_by_id` on the `follows` table. All the data in the column will be lost.
  - Added the required column `follower_id` to the `follows` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "follows" DROP CONSTRAINT "follows_followed_by_id_fkey";

-- AlterTable
ALTER TABLE "follows" DROP CONSTRAINT "follows_pkey",
DROP COLUMN "followed_by_id",
ADD COLUMN     "follower_id" TEXT NOT NULL,
ADD CONSTRAINT "follows_pkey" PRIMARY KEY ("following_id", "follower_id");

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
