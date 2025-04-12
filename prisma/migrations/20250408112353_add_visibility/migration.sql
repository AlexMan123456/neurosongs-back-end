-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('public', 'unlisted', 'restricted', 'private');

-- AlterTable
ALTER TABLE "albums" ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'public';

-- AlterTable
ALTER TABLE "songs" ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'public';
