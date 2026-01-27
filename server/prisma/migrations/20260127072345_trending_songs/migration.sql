-- CreateTable
CREATE TABLE "TrendingSong" (
    "song_id" UUID NOT NULL,
    "score" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrendingSong_pkey" PRIMARY KEY ("song_id")
);

-- CreateIndex
CREATE INDEX "TrendingSong_rank_idx" ON "TrendingSong"("rank");

-- AddForeignKey
ALTER TABLE "TrendingSong" ADD CONSTRAINT "TrendingSong_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "Song"("song_id") ON DELETE CASCADE ON UPDATE CASCADE;
