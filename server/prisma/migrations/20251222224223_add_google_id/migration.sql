/*
  Warnings:

  - You are about to drop the column `friends_count` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `playlists_created` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `playlists_liked` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `songs_contributed` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `songs_liked` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[google_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "friends_count",
DROP COLUMN "playlists_created",
DROP COLUMN "playlists_liked",
DROP COLUMN "songs_contributed",
DROP COLUMN "songs_liked",
ADD COLUMN     "google_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_google_id_key" ON "User"("google_id");
