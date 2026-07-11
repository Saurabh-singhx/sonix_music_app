-- CreateTable
CREATE TABLE "SongEmbedding" (
    "song_id" UUID NOT NULL,
    "model" TEXT NOT NULL DEFAULT 'text-embedding-004',
    "embedding" vector(768),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SongEmbedding_pkey" PRIMARY KEY ("song_id")
);

-- AddForeignKey
ALTER TABLE "SongEmbedding" ADD CONSTRAINT "SongEmbedding_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "Song"("song_id") ON DELETE CASCADE ON UPDATE CASCADE;
