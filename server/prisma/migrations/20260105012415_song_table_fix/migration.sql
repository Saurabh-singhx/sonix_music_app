/*
  Warnings:

  - You are about to drop the column `s3Key` on the `Song` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[song_url]` on the table `Song` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Song_s3Key_key";

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "s3Key";

-- CreateIndex
CREATE UNIQUE INDEX "Song_song_url_key" ON "Song"("song_url");
