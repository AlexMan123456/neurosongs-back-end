/*
  Warnings:

  - You are about to drop the column `is_verified` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_verified",
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "profile_picture" TEXT NOT NULL DEFAULT 'default-profile-picture.jpg';
