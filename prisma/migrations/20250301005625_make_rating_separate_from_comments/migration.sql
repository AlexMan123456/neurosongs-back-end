/*
  Warnings:

  - You are about to drop the column `rating` on the `comments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "comments" DROP COLUMN "rating";

-- CreateTable
CREATE TABLE "Rating" (
    "rating_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "song_id" INTEGER,
    "album_id" INTEGER,
    "score" DECIMAL(3,1) NOT NULL,
    "is_visible" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("rating_id")
);
