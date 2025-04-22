/*
  Warnings:

  - You are about to drop the `Link` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_user_id_fkey";

-- DropTable
DROP TABLE "Link";

-- CreateTable
CREATE TABLE "links" (
    "link_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "links_pkey" PRIMARY KEY ("link_id")
);

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
