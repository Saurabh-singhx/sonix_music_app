import prisma from "../lib/prisma.js";

import { SongEventType } from "../generated/prisma/client.js";
import { calculateSongSuggestion } from "./suggestion.services.js";

const EVENT_WEIGHT: Partial<Record<SongEventType, number>> = {
    COMPLETE: 3,
    REPEAT: 3,
    PLAY: 1,
    SKIP: -3,
};



export const updateRecommendations = async (user_id: string) => {

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
            liked_at: "asc"
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
        // fix here ==----==>

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

}


export const createSongDetailsForAi = async () => {


    const suggestions = await calculateSongSuggestion();

    const songIds = suggestions.map(s => s.songId);

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

    const candidateText = songDetails.map((song, idx) => {
        return `${idx + 1}. ${song.song_title} | ${song.aiProfile?.language
            } | ${song.genre} | ${song.aiProfile?.mood} | ${song.aiProfile?.energy_level} | ${song.aiProfile?.vibe_tags}`;
    }).join("\n");

    return candidateText;

}