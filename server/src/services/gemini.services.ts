import ai from "../config/gemini.js";
import prisma from '../lib/prisma.js';

export type AiRecommendation = {
  song_title: string;
  song_index: number;
  score: number;
  reason: string;
};

export type songDetailsData = {
  mood: string;
  energy_level: string;
  genre: string;
  tags: string[];
  releaseDate: string;
  duration: string;
  language: string;
}

interface EmbedResponse {
  embedding: { values: number[] };
}

export const geminiAiResponseRecommendations = async (
  summary: string,
  songDataDetails: string,
  maxRetries: number = 5
): Promise<AiRecommendation[] | null> => {

  if (!songDataDetails.length) {
    console.log("songDataDetails not found");
    return null;
  }

  let attempted = 0;
  while (attempted < maxRetries) {
    try {
      const prompt = `
          You are a music recommendation engine.
          Return ONLY a valid JSON array. No markdown, no backticks, no explanation outside the JSON.

            USER LISTENING SUMMARY:
              ${summary}

            CANDIDATE SONGS:
              ${songDataDetails}

          Return JSON in this exact format:
          [
            {
              "song_title": "Blinding Lights",
              "song_index": 0,
              "score": 0.95,
              "reason": "Matches the upbeat energetic mood in your listening history"
            }
          ]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          temperature: 0,
          responseMimeType: "application/json",
        },
      });

      const text = response.text;
      if (!text) throw new Error("Empty response");

      const parsed = JSON.parse(text);

      if (!Array.isArray(parsed)) {
        throw new Error("AI response is not an array");
      }

      for (const item of parsed) {
        if (
          typeof item.song_title !== "string" ||
          typeof item.reason !== "string" ||
          typeof item.song_index !== "number" ||
          typeof item.score !== "number"
        ) {
          throw new Error("Invalid AI response format");
        }
      }

      return parsed as AiRecommendation[];
    } catch (err) {
      attempted++;
      console.warn(`Gemini attempt ${attempted} failed:`, err);

      if (attempted >= maxRetries) {
        console.error("All retries exhausted");
        return null;
      }

      // Exponential backoff: wait 1s, 2s, 4s before each retry
      const delay = 1000 * Math.pow(2, attempted - 1);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  return null;
};


//for uploading songs ==----==>

export const songDetailsFromAi = async (songName: string, artistName: string): Promise<songDetailsData | null> => {

  if (!songName || !artistName) {
    throw new Error("song name or artist name not specified")
  }

  let attempted = 0;

  while (attempted < 3) {
    try {

      const prompt = `I will give you song name and artist name search and give its orignal details like 
    MOODS = ['Happy', 'Sad', 'Energetic', 'Calm', 'Romantic', 'Melancholic', 'Aggressive', 'Peaceful'],
    ENERGY_LEVELS = ['Low', 'Medium', 'High', 'Very High'],
    GENRES = ['Pop', 'Rock', 'Hip-Hop', 'R&B', 'Jazz', 'Classical', 'Electronic', 'Country', 'Reggae', 'Blues', 'Folk', 'Metal', 'Indie', 'Soul', 'Funk', 'Other'],
    TAGS = [in this section add 5-10 tags related to songs],
    releaseDate= orignal release date of song,
    duration = song duraation in seconds,
    language = song language if there's multiple select one
    return this in json format like 
    {
      "mood": "string",
      "energy_level": "string",
      "genre": "string",
      "tags": ["string"],
      "releaseDate": "YYYY-MM-DD",
      "duration":"string",
      "language":"string"
    }
    songName:${songName}
    artistName:${artistName}`

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          temperature: 0,
          responseMimeType: "application/json",
        },
      });

      const data = response.text;

      if (!data) throw new Error("Empty response");

      const parsedData = JSON.parse(data);

      if (
        typeof parsedData.mood !== "string" ||
        typeof parsedData.energy_level !== "string" ||
        typeof parsedData.genre !== "string" ||
        !Array.isArray(parsedData.tags) ||
        typeof parsedData.releaseDate !== "string" ||
        typeof parsedData.duration !== "string" ||
        typeof parsedData.language !== "string"
      ) {
        throw new Error("Invalid song details format");  // triggers retry
      }

      return parsedData as songDetailsData;

    } catch (error) {
      attempted++;
      console.warn(`Gemini attempt ${attempted} failed:`, error);

      if (attempted >= 3) {
        console.error("All retries exhausted");
        return null;
      }

      // Exponential backoff: wait 1s, 2s, 4s before each retry
      const delay = 1000 * Math.pow(2, attempted - 1);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  return null;

}


async function generateEmbedding(text: string): Promise<number[]> {

  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: text,
    config: {
      outputDimensionality: 768
    }
  });
  if (!response.embeddings?.[0]?.values) {
    throw new Error("Unexpected embedding response shape from Gemini");
  }

  return response.embeddings[0].values;
}

export async function backfillAll() {
  const songs = await prisma.song.findMany({
    where: { embedding: null },
    select: {
      song_id: true,
      song_title: true,
      genre: true,
      release_date: true,
      aiProfile: true,
      artist: true,
    }
  });

  console.log(`Found ${songs.length} songs to embed`);

  for (const [i, song] of songs.entries()) {
    try {
      const year = song.release_date?.getFullYear();
      const text = `${song.song_title} ${song.artist?.artist_name} ${song.genre} ${year} ${song.aiProfile?.mood} ${song.aiProfile?.energy_level} ${song.aiProfile?.language} some tags: ${song.aiProfile?.vibe_tags}`;
      const vector = await generateEmbedding(text);

      await prisma.$executeRaw`
      INSERT INTO "SongEmbedding" (song_id, model, embedding, "updatedAt")
      VALUES (${song.song_id}::uuid, 'gemini-embedding-2', ${JSON.stringify(vector)}::vector, NOW())
      ON CONFLICT (song_id) DO UPDATE SET embedding = EXCLUDED.embedding, "updatedAt" = NOW()
      `;

      console.log(`[${i + 1}/${songs.length}] Embedded: ${song.song_title}`);
    } catch (err) {
      console.error(`Failed on song ${song.song_id} (${song.song_title}):`, err);
    }

    // small delay to stay safely under rate limits
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log("Done.");
}