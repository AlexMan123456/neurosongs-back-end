-- DropForeignKey
ALTER TABLE "album_ratings" DROP CONSTRAINT "album_ratings_album_id_fkey";

-- DropForeignKey
ALTER TABLE "album_ratings" DROP CONSTRAINT "album_ratings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "albums" DROP CONSTRAINT "albums_user_id_fkey";

-- DropForeignKey
ALTER TABLE "comment_notifications" DROP CONSTRAINT "comment_notifications_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "comment_notifications" DROP CONSTRAINT "comment_notifications_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "comment_notifications" DROP CONSTRAINT "comment_notifications_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_album_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_replying_to_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_song_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "follows" DROP CONSTRAINT "follows_follower_id_fkey";

-- DropForeignKey
ALTER TABLE "follows" DROP CONSTRAINT "follows_following_id_fkey";

-- DropForeignKey
ALTER TABLE "song_ratings" DROP CONSTRAINT "song_ratings_song_id_fkey";

-- DropForeignKey
ALTER TABLE "song_ratings" DROP CONSTRAINT "song_ratings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "songs" DROP CONSTRAINT "songs_album_id_fkey";

-- DropForeignKey
ALTER TABLE "songs" DROP CONSTRAINT "songs_user_id_fkey";

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "albums"("album_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "albums"("album_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_replying_to_id_fkey" FOREIGN KEY ("replying_to_id") REFERENCES "comments"("comment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "songs"("song_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song_ratings" ADD CONSTRAINT "song_ratings_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "songs"("song_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song_ratings" ADD CONSTRAINT "song_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album_ratings" ADD CONSTRAINT "album_ratings_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "albums"("album_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album_ratings" ADD CONSTRAINT "album_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_notifications" ADD CONSTRAINT "comment_notifications_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("comment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_notifications" ADD CONSTRAINT "comment_notifications_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_notifications" ADD CONSTRAINT "comment_notifications_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
