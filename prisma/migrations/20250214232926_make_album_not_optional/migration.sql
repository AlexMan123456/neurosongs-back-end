/*
  Warnings:

  - Made the column `album_id` on table `songs` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "songs" DROP CONSTRAINT "songs_album_id_fkey";

-- AlterTable
ALTER TABLE "songs" ALTER COLUMN "album_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "albums"("album_id") ON DELETE RESTRICT ON UPDATE CASCADE;
