-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "user_name" VARCHAR(50) NOT NULL,
    "user_email" VARCHAR(255) NOT NULL,
    "user_password" TEXT NOT NULL,
    "user_profile_pic" TEXT NOT NULL DEFAULT '',
    "date_of_birth" TIMESTAMP(3),
    "gender" VARCHAR(20),
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "songs_liked" INTEGER NOT NULL DEFAULT 0,
    "playlists_liked" INTEGER NOT NULL DEFAULT 0,
    "playlists_created" INTEGER NOT NULL DEFAULT 0,
    "songs_contributed" INTEGER NOT NULL DEFAULT 0,
    "friends_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Song" (
    "song_id" TEXT NOT NULL,
    "song_title" VARCHAR(200) NOT NULL,
    "song_url" TEXT NOT NULL,
    "artist_name" VARCHAR(50),
    "album_name" VARCHAR(50),
    "duration" INTEGER NOT NULL,
    "genre" VARCHAR(30),
    "release_date" TIMESTAMP(3),
    "cover_image_url" TEXT NOT NULL DEFAULT '',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Song_pkey" PRIMARY KEY ("song_id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "playlist_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "playlist_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("playlist_id")
);

-- CreateTable
CREATE TABLE "PlaylistSong" (
    "playlist_id" TEXT NOT NULL,
    "song_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlaylistSong_pkey" PRIMARY KEY ("playlist_id","song_id")
);

-- CreateTable
CREATE TABLE "LikedSong" (
    "user_id" TEXT NOT NULL,
    "song_id" TEXT NOT NULL,
    "liked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LikedSong_pkey" PRIMARY KEY ("user_id","song_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_email_key" ON "User"("user_email");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistSong_playlist_id_position_key" ON "PlaylistSong"("playlist_id", "position");

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistSong" ADD CONSTRAINT "PlaylistSong_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "Playlist"("playlist_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistSong" ADD CONSTRAINT "PlaylistSong_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "Song"("song_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedSong" ADD CONSTRAINT "LikedSong_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "Song"("song_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedSong" ADD CONSTRAINT "LikedSong_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

