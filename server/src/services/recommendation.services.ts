import prisma from "../lib/prisma.js";

import { SongEventType } from "../generated/prisma/client.js";

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
                    likedByUsers:{
                        where:{
                            user_id
                        }
                    }
                },
                
            },
        },
    });


    const genreScore: Record<string, number> = {};
    const moodScore: Record<string, number> = {};
    const energyScore: Record<string, number> = {};
    const artistScore: Record<string, number> = {};


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
    }


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