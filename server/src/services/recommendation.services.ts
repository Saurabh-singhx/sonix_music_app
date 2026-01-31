import prisma from "../lib/prisma.js";

import { SongEventType } from "../generated/prisma/client.js";
import { calculateSongSuggestion } from "./suggestion.services.js";


import { aiResponseRecommendations } from "./openai.services.js";
import { geminiAiResponseRecommendations } from "./gemini.services.js";
const EVENT_WEIGHT: Partial<Record<SongEventType, number>> = {
    COMPLETE: 3,
    REPEAT: 3,
    PLAY: 1,
    SKIP: -3,
};

export const updateRecommendationsSummary = async (user_id: string) => {

    try {
        const events = await prisma.userSongEvent.findMany({
            where: {
                user_id,
                created_at: {
                    gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                },
            },
            include: {
                song: {
                    include: {
                        aiProfile: true,
                    },

                },
            },
        });


        const likedSong = await prisma.likedSong.findMany({
            take: 5,
            where: {
                user_id
            },
            orderBy: {
                liked_at: "desc"
            },
            select: {
                song: {
                    select: {
                        aiProfile: {
                            select: {
                                language: true,
                                mood: true,
                                vibe_tags: true,
                                energy_level: true
                            }
                        }
                    }
                }
            }
        });

        const likedLanguageScore: Record<string, number> = {};
        const likedMoodScore: Record<string, number> = {};
        const likedEnergyScore: Record<string, number> = {};


        for (const userLike of likedSong) {
            const profile = userLike.song.aiProfile;
            if (!profile) continue;

            if (profile.language) {
                likedLanguageScore[profile.language] =
                    (likedLanguageScore[profile.language] || 0) + 5;
            }

            if (profile.mood) {
                likedMoodScore[profile.mood] =
                    (likedMoodScore[profile.mood] || 0) + 5;
            }

            if (profile.energy_level) {
                likedEnergyScore[profile.energy_level] =
                    (likedEnergyScore[profile.energy_level] || 0) + 5;
            }
        }



        const genreScore: Record<string, number> = {};
        const moodScore: Record<string, number> = {};
        const energyScore: Record<string, number> = {};
        const artistScore: Record<string, number> = {};
        const languageScore: Record<string, number> = {};



        for (const event of events) {
            const weight = EVENT_WEIGHT[event.event_type] ?? 0;
            const profile = event.song.aiProfile;
            if (!profile) continue;

            if (event.song.genre) {
                genreScore[event.song.genre] = Math.max(
                    (genreScore[event.song.genre] || 0) + weight,
                    0
                );

            }

            if (profile.mood) {
                moodScore[profile.mood] = Math.max(
                    (moodScore[profile.mood] || 0) + weight,
                    0
                );
            }

            if (profile.energy_level) {
                energyScore[profile.energy_level] =
                    Math.max((energyScore[profile.energy_level] || 0) + weight, 0);
            }

            if (event.song.artist_name) {
                artistScore[event.song.artist_name] =
                    Math.max((artistScore[event.song.artist_name] || 0) + weight, 0);
            }
            

            if (profile.language) {
                languageScore[profile.language] = Math.max(
                    (languageScore[profile.language] || 0) + weight,
                    0
                );
            }


        }

        Object.entries(likedLanguageScore).forEach(([k, v]) => {
            languageScore[k] = (languageScore[k] || 0) + v;
        });

        Object.entries(likedMoodScore).forEach(([k, v]) => {
            moodScore[k] = (moodScore[k] || 0) + v;
        });

        Object.entries(likedEnergyScore).forEach(([k, v]) => {
            energyScore[k] = (energyScore[k] || 0) + v;
        });



        function topKeys(obj: Record<string, number>, limit = 3) {
            return Object.entries(obj)
                .sort((a, b) => b[1] - a[1])
                .slice(0, limit)
                .map(([key]) => key);
        }

        const topGenres = topKeys(genreScore);
        const topMoods = topKeys(moodScore);
        const topEnergy = topKeys(energyScore, 1);
        const topArtists = topKeys(artistScore, 2);


        if (
            Object.keys(genreScore).length === 0 &&
            Object.keys(artistScore).length === 0
        ) {
            console.log("no data in scores")
            return; // don’t write junk
        }



        let summary = `User prefers ${topGenres.join(", ")} music`;

        if (topEnergy.length) {
            summary += ` with ${topEnergy[0]} energy`;
        }

        if (topMoods.length) {
            summary += `, often listens to ${topMoods.join(" and ")} mood songs`;
        }

        if (topArtists.length) {
            summary += `. Frequently listens to artists like ${topArtists.join(", ")}`;
        }

        const topLanguages = topKeys(languageScore, 2);

        if (topLanguages.length) {
            summary += `. Prefers songs in ${topLanguages.join(" and ")} language`;
        }


        summary += ".";


        await prisma.userTasteSummary.upsert({
            where: { user_id },
            update: {
                summary_text: summary,
            },
            create: {
                user_id,
                summary_text: summary,
            },
        });

        return summary;
    } catch (error) {
        console.error(error, "error while updating recommendation summary")
    }

}


export type AiRecommendation2 = {
    song_title: string;
    song_id: string;
    score: number;
    reason: string;
};

export const updateRecommendationWithAi = async (summary: string, user_id: string) => {


    try {

        let songIdMap = new Map<number, { song_id: string; baseScore: number }>();

        const suggestions = await calculateSongSuggestion();

        if (!suggestions?.length) {
            console.log("song base suggestions not found...")

            //tesing here ...
            // console.log("trying gemini directly...")

            // const TestSongDetails = await prisma.song.findMany({
            //     select: {
            //     song_id: true,
            //     song_title: true,
            //     genre: true,
            //     aiProfile: {
            //         select: {
            //             language: true,
            //             mood: true,
            //             energy_level: true,
            //             vibe_tags: true
            //         }
            //     }
            //     }


            // });

            
            // const candidateText = TestSongDetails.map((song,idx) => {

            //     // const song = TestSongDetails.find(s => s.song_id === meta.song_id);// fix here <<==----==
            //     // if (!song) return null;

            //     return `
            //     ${idx}.
            //         song_title: ${song.song_title ?? "NA"}
            //         genre: ${song.genre ?? "NA"}
            //         mood: ${song.aiProfile?.mood ?? "NA"}
            //         energy: ${song.aiProfile?.energy_level ?? "NA"}
            //         language: ${song.aiProfile?.language ?? "NA"}
            //         tags: ${song.aiProfile?.vibe_tags?.join(",") ?? "NA"}`;
            // })
            // .filter(Boolean)
            // .join("\n");

            // const responsefromai = await geminiAiResponseRecommendations("user likes english songs", candidateText);

            // console.log(responsefromai);
            return;
        }

        let index = 1;
        for (const s of suggestions) {
            if (!s.songId) {
                continue;
            }
            songIdMap.set(index++, {
                song_id: s.songId,
                baseScore: s.score
            });
        }

        const songIds = Array.from(songIdMap.values()).map(v => v.song_id);

        const songDetails = await prisma.song.findMany({
            where: {
                song_id: { in: songIds }
            },
            select: {
                song_id: true,
                song_title: true,
                genre: true,
                aiProfile: {
                    select: {
                        language: true,
                        mood: true,
                        energy_level: true,
                        vibe_tags: true
                    }
                }
            }
        });



        const candidateText = Array.from(songIdMap.entries())
            .map(([idx, meta]) => {
                const song = songDetails.find(s => s.song_id === meta.song_id);// fix here <<==----==
                if (!song) return null;

                return `
                ${idx}.
                    song_title: ${song.song_title ?? "NA"}
                    base_score: ${meta.baseScore}
                    genre: ${song.genre ?? "NA"}
                    mood: ${song.aiProfile?.mood ?? "NA"}
                    energy: ${song.aiProfile?.energy_level ?? "NA"}
                    language: ${song.aiProfile?.language ?? "NA"}
                    tags: ${song.aiProfile?.vibe_tags?.join(",") ?? "NA"}`;
            })
            .filter(Boolean)
            .join("\n");


        const aiResponse = await aiResponseRecommendations(summary, candidateText);

        if (!aiResponse) {
            console.log("no response from ai to update recommendation");
            return;
        }

        const newSongAiResponse: AiRecommendation2[] = [];

        for (const aiS of aiResponse) {
            const index = aiS.song_index;
            if (!songIdMap.has(index)) {

                console.log(`index ${index} not found in map`)
                continue;
            }

            const dbScore = songIdMap.get(index)!;

            newSongAiResponse.push({
                song_id: songIdMap.get(index)?.song_id!,
                song_title: aiS.song_title,
                score: aiS.score + dbScore.baseScore,  //after testing => score: dbScore.baseScore * 0.7 + aiS.score * 0.3 <<==----==

                reason: aiS.reason
            })

        }

        if (newSongAiResponse.length === 0) {
            console.log("newSongAiResponse is empty")
            return;
        }


        await prisma.$transaction([



            prisma.recommendation.deleteMany({
                where: { user_id }
            }),

            prisma.recommendation.createMany({
                data: newSongAiResponse.map((s) => ({
                    song_id: s.song_id,
                    user_id,
                    reason: s.reason,
                    score: s.score
                }))
            })

        ]);


        console.log("song recommendations songs inserted in table...")


    } catch (error) {
        console.error(error, "error in updateRecommendationWithAi")
    }

}



// ================= RECOMMENDATION SYSTEM IMPROVEMENTS =================

// 1. Normalize scores per user
// Problem: Heavy users dominate scoring (more events = higher scores)
// Fix: Divide event-based score by total user events or use log scaling
// Example: score = score / Math.log(totalUserEvents + 1)

// 2. Add time decay inside the time window
// Problem: 7-day-old activity == 1-hour-old activity
// Fix: Apply exponential decay based on event age
// Example: weight *= Math.exp(-hoursSinceEvent / HALF_LIFE_HOURS)

// 3. Add exploration factor (ε-greedy)
// Problem: System gets stuck recommending same taste cluster
// Fix: Inject 5–10% random high-quality songs
// Example: if (Math.random() < 0.1) pickRandomTrendingSong()

// 4. Diversity penalty
// Problem: Same artist/genre can dominate recommendations
// Fix: Penalize repeated artist/genre in final ranking
// Example: score -= artistRepeatCount * DIVERSITY_PENALTY

// 5. Cap per-song contribution
// Problem: Viral songs overpower everything
// Fix: Clamp max contribution per song
// Example: score = Math.min(score, MAX_SCORE)

// 6. Cold-start strategy
// Problem: New users have no history
// Fix: Fallback to trending + language/region default
// Example: if (userEvents === 0) return trendingByLanguage()

// 7. AI score calibration
// Problem: AI score range may not match algorithm score
// Fix: Normalize AI score to 0–1 before blending
// Example: aiScore = aiScore / 100

// 8. Config-driven weights
// Problem: Hardcoded weights require redeploy
// Fix: Store weights in DB or env
// Example: EVENT_WEIGHT[PLAY] = config.PLAY_WEIGHT

// 9. Batch AI calls
// Problem: One AI call per user = expensive
// Fix: Batch users or cache summaries
// Example: group users with similar taste summaries

// 10. Recommendation versioning
// Problem: deleteMany + createMany loses history
// Fix: Add batch_id / version field
// Example: recommendation_batch_id = uuid()

// 11. Enforce uniqueness
// Problem: Duplicate song recommendations possible
// Fix: Unique index (user_id, song_id)

// 12. Add metrics logging
// Problem: No feedback loop
// Fix: Track CTR, skips after recommendation
// Example: logRecommendationInteraction(user_id, song_id, action)

// 13. Session-aware intent
// Problem: Historical taste ≠ current mood
// Fix: Boost songs matching last 30-min behavior
// Example: recentMoodWeight * 1.5

// 14. Cache heavy aggregations
// Problem: groupBy is expensive
// Fix: Precompute daily song scores
// Example: song_trending_score_daily table

// 15. Hard fallback safety
// Problem: AI failure returns nothing
// Fix: Always return top algorithmic suggestions
// Example: if (aiFailed) use baseScoresOnly()

// =====================================================================
