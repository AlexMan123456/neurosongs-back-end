/*
  Warnings:

  - You are about to drop the column `username` on the `albums` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `songs` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `albums` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `songs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "albums" DROP CONSTRAINT "albums_username_fkey";

-- DropForeignKey
ALTER TABLE "songs" DROP CONSTRAINT "songs_username_fkey";

-- AlterTable
ALTER TABLE "albums" DROP COLUMN "username",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "songs" DROP COLUMN "username",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ADD COLUMN     "user_id" TEXT NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
