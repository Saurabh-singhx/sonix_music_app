import prisma from "../lib/prisma.js";

const EVENT_SCORES: Record<string, number> = {
  PLAY: 2,
  COMPLETE: 4,
  REPEAT: 3,
  SKIP: -1
};

const LIKE_SCORE = 5;
const TRENDING_LIMIT = 10;
const TIME_WINDOW_HOURS = 24*7;

export async function calculateTrending() {
  const since = new Date(
    Date.now() - TIME_WINDOW_HOURS * 60 * 60 * 1000
  );

  // Aggregate song events ==----==>
  const eventAgg = await prisma.userSongEvent.groupBy({
    by: ["song_id", "event_type"],
    where: {
      created_at: { gte: since }
    },
    _count: {
      _all: true
    }
  });

  // Aggregate likes ==----==>
  const likeAgg = await prisma.likedSong.groupBy({
    by: ["song_id"],
    where: {
      liked_at: { gte: since }
    },
    _count: {
      _all: true
    }
  });

  // computing scores ==----==>
  const scoreMap = new Map<string, number>();

  for (const row of eventAgg) {
    const weight = EVENT_SCORES[row.event_type] ?? 0;
    if (weight === 0) continue;

    const prev = scoreMap.get(row.song_id) ?? 0;
    scoreMap.set(
      row.song_id,
      prev + row._count._all * weight
    );
  }

  for (const row of likeAgg) {
    const prev = scoreMap.get(row.song_id) ?? 0;
    scoreMap.set(
      row.song_id,
      prev + row._count._all * LIKE_SCORE
    );
  }

  // Sort & limit ==----==>
  const trending = [...scoreMap.entries()]
    .map(([songId, score]) => ({ songId, score }))
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, TRENDING_LIMIT);

  return trending;
}

// Update Trending Table ==----==>
export async function updateTrendingTable() {
  const trending = await calculateTrending();

  await prisma.$transaction([
    prisma.trendingSong.deleteMany(),
    prisma.trendingSong.createMany({
      data: trending.map((t, index) => ({
        song_id: t.songId,
        score: t.score,
        rank: index + 1
      }))
    })
  ]);
}
