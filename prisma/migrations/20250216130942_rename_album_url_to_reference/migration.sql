/*
  Warnings:

  - You are about to drop the column `back_cover_url` on the `albums` table. All the data in the column will be lost.
  - You are about to drop the column `front_cover_url` on the `albums` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "albums" DROP COLUMN "back_cover_url",
DROP COLUMN "front_cover_url",
ADD COLUMN     "back_cover_reference" TEXT,
ADD COLUMN     "front_cover_reference" TEXT NOT NULL DEFAULT '';
