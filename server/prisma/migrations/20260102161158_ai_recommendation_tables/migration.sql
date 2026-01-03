-- CreateEnum
CREATE TYPE "SongEventType" AS ENUM ('PLAY', 'SKIP', 'PAUSE', 'COMPLETE', 'REPEAT');

-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "popularity_score" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "UserSongEvent" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "song_id" UUID NOT NULL,
    "event_type" "SongEventType" NOT NULL,
    "play_duration" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSongEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SongAIProfile" (
    "song_id" UUID NOT NULL,
    "mood" TEXT,
    "energy_level" TEXT,
    "language" TEXT,
    "vibe_tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SongAIProfile_pkey" PRIMARY KEY ("song_id")
);

-- CreateTable
CREATE TABLE "UserTasteSummary" (
    "user_id" UUID NOT NULL,
    "summary_text" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTasteSummary_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "song_id" UUID NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "user_id" UUID NOT NULL,
    "preferred_genres" TEXT[],
    "preferred_moods" TEXT[],
    "preferred_language" TEXT[],

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE INDEX "UserSongEvent_user_id_idx" ON "UserSongEvent"("user_id");

-- CreateIndex
CREATE INDEX "UserSongEvent_song_id_idx" ON "UserSongEvent"("song_id");

-- CreateIndex
CREATE INDEX "Recommendation_user_id_idx" ON "Recommendation"("user_id");

-- AddForeignKey
ALTER TABLE "UserSongEvent" ADD CONSTRAINT "UserSongEvent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSongEvent" ADD CONSTRAINT "UserSongEvent_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "Song"("song_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongAIProfile" ADD CONSTRAINT "SongAIProfile_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "Song"("song_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTasteSummary" ADD CONSTRAINT "UserTasteSummary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "Song"("song_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
