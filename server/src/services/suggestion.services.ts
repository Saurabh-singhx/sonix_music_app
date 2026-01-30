import prisma from "../lib/prisma.js";

const EVENT_SCORES: Record<string, number> = { //need fixing here <<==----==
  PLAY: 2,
  COMPLETE: 4,
  REPEAT: 3,
  SKIP: -1
};

const LIKE_SCORE = 5;
const TRENDING_LIMIT = 100;
const TIME_WINDOW_HOURS = 24 * 7;

export const calculateSongSuggestion = async () => {
  try {

    // Aggregate song events ==----==>
    const eventAgg = await prisma.userSongEvent.groupBy({
      by: ["song_id", "event_type"],
      _count: {
        _all: true
      }
    });

    // Aggregate likes ==----==>
    const likeAgg = await prisma.likedSong.groupBy({
      by: ["song_id"],
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
    const suggestion = [...scoreMap.entries()]
      .map(([songId, score]) => ({ songId, score }))
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, TRENDING_LIMIT);

    return suggestion;
  } catch (error) {
    console.error(error,"error while generating song suggestions")
  }
}
