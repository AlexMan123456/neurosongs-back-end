-- AlterTable
ALTER TABLE "albums" ADD COLUMN     "is_featured" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "songs" ADD COLUMN     "is_featured" BOOLEAN NOT NULL DEFAULT false;
