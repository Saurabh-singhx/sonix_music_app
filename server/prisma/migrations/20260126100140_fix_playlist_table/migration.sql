/*
  Warnings:

  - A unique constraint covering the columns `[user_id,playlist_name]` on the table `Playlist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Playlist_created_at_idx" ON "Playlist"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_user_id_playlist_name_key" ON "Playlist"("user_id", "playlist_name");
