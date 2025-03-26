/*
  Warnings:

  - You are about to drop the column `is_artist` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_artist",
ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;
