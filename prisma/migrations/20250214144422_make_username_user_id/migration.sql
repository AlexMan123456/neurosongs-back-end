/*
  Warnings:

  - You are about to drop the column `user_id` on the `albums` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `songs` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `users` table. All the data in the column will be lost.
  - Added the required column `username` to the `albums` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `songs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `global_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "albums" DROP CONSTRAINT "albums_user_id_fkey";

-- DropForeignKey
ALTER TABLE "songs" DROP CONSTRAINT "songs_user_id_fkey";

-- DropIndex
DROP INDEX "users_username_key";

-- AlterTable
ALTER TABLE "albums" DROP COLUMN "user_id",
ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "songs" DROP COLUMN "user_id",
ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "global_name" VARCHAR(100) NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("username");

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_username_fkey" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_username_fkey" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
