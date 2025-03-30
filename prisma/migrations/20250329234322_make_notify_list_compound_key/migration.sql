/*
  Warnings:

  - The primary key for the `notify_list` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "notify_list" DROP CONSTRAINT "notify_list_pkey",
ADD CONSTRAINT "notify_list_pkey" PRIMARY KEY ("user_id", "comment_id");
