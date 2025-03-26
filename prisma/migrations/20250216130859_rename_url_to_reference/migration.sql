/*
  Warnings:

  - You are about to drop the column `url` on the `songs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "songs" DROP COLUMN "url",
ADD COLUMN     "reference" TEXT NOT NULL DEFAULT '';
