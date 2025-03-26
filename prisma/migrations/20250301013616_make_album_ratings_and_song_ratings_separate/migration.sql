/*
  Warnings:

  - You are about to drop the `Rating` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Rating";

-- CreateTable
CREATE TABLE "song_ratings" (
    "user_id" TEXT NOT NULL,
    "song_id" INTEGER NOT NULL,
    "score" DECIMAL(3,1) NOT NULL,
    "is_visible" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "song_ratings_pkey" PRIMARY KEY ("user_id","song_id")
);

-- CreateTable
CREATE TABLE "album_ratings" (
    "user_id" TEXT NOT NULL,
    "album_id" INTEGER NOT NULL,
    "score" DECIMAL(3,1) NOT NULL,
    "is_visible" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "album_ratings_pkey" PRIMARY KEY ("user_id","album_id")
);

-- AddForeignKey
ALTER TABLE "song_ratings" ADD CONSTRAINT "song_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song_ratings" ADD CONSTRAINT "song_ratings_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "songs"("song_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album_ratings" ADD CONSTRAINT "album_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album_ratings" ADD CONSTRAINT "album_ratings_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "albums"("album_id") ON DELETE RESTRICT ON UPDATE CASCADE;
