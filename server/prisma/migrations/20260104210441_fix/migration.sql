/*
  Warnings:

  - A unique constraint covering the columns `[artist_name]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Artist_artist_name_key" ON "Artist"("artist_name");
