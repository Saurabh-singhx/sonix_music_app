/*
  Warnings:

  - The primary key for the `LikedSong` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Playlist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PlaylistSong` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Song` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `user_id` on the `LikedSong` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `song_id` on the `LikedSong` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `playlist_id` on the `Playlist` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `Playlist` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `playlist_id` on the `PlaylistSong` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `song_id` on the `PlaylistSong` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `song_id` on the `Song` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "LikedSong" DROP CONSTRAINT "LikedSong_song_id_fkey";

-- DropForeignKey
ALTER TABLE "LikedSong" DROP CONSTRAINT "LikedSong_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_user_id_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistSong" DROP CONSTRAINT "PlaylistSong_playlist_id_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistSong" DROP CONSTRAINT "PlaylistSong_song_id_fkey";

-- AlterTable
ALTER TABLE "LikedSong" DROP CONSTRAINT "LikedSong_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID NOT NULL,
DROP COLUMN "song_id",
ADD COLUMN     "song_id" UUID NOT NULL,
ADD CONSTRAINT "LikedSong_pkey" PRIMARY KEY ("user_id", "song_id");

-- AlterTable
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_pkey",
DROP COLUMN "playlist_id",
ADD COLUMN     "playlist_id" UUID NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID NOT NULL,
ADD CONSTRAINT "Playlist_pkey" PRIMARY KEY ("playlist_id");

-- AlterTable
ALTER TABLE "PlaylistSong" DROP CONSTRAINT "PlaylistSong_pkey",
DROP COLUMN "playlist_id",
ADD COLUMN     "playlist_id" UUID NOT NULL,
DROP COLUMN "song_id",
ADD COLUMN     "song_id" UUID NOT NULL,
ADD CONSTRAINT "PlaylistSong_pkey" PRIMARY KEY ("playlist_id", "song_id");

-- AlterTable
ALTER TABLE "Song" DROP CONSTRAINT "Song_pkey",
ADD COLUMN     "artist_id" UUID,
DROP COLUMN "song_id",
ADD COLUMN     "song_id" UUID NOT NULL,
ADD CONSTRAINT "Song_pkey" PRIMARY KEY ("song_id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER',
DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("user_id");

-- CreateTable
CREATE TABLE "Artist" (
    "artist_id" UUID NOT NULL,
    "artist_name" VARCHAR(150) NOT NULL,
    "artist_bio" TEXT,
    "artist_profilePic" VARCHAR(255),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("artist_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistSong_playlist_id_position_key" ON "PlaylistSong"("playlist_id", "position");

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artist"("artist_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistSong" ADD CONSTRAINT "PlaylistSong_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "Playlist"("playlist_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistSong" ADD CONSTRAINT "PlaylistSong_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "Song"("song_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedSong" ADD CONSTRAINT "LikedSong_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedSong" ADD CONSTRAINT "LikedSong_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "Song"("song_id") ON DELETE CASCADE ON UPDATE CASCADE;
