/*
  Warnings:

  - You are about to drop the column `artist_name` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the `TrendingSong` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `size` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TrendingSong" DROP CONSTRAINT "TrendingSong_song_id_fkey";

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "artist_name",
DROP COLUMN "duration",
ADD COLUMN     "size" INTEGER NOT NULL;

-- DropTable
DROP TABLE "TrendingSong";

-- CreateTable
CREATE TABLE "TrendingSongs" (
    "song_id" UUID NOT NULL,
    "score" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrendingSongs_pkey" PRIMARY KEY ("song_id")
);

-- CreateTable
CREATE TABLE "Song_suggestion" (
    "song_id" UUID NOT NULL,
    "score" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Song_suggestion_pkey" PRIMARY KEY ("song_id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE INDEX "TrendingSongs_rank_idx" ON "TrendingSongs"("rank");

-- AddForeignKey
ALTER TABLE "TrendingSongs" ADD CONSTRAINT "TrendingSongs_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "Song"("song_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song_suggestion" ADD CONSTRAINT "Song_suggestion_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "Song"("song_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
