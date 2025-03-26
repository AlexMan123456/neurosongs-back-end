/*
  Warnings:

  - You are about to drop the column `global_name` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "global_name",
ADD COLUMN     "artist_name" VARCHAR(100) NOT NULL DEFAULT '';
