import ai from "../config/gemini.js";

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
  releaseDate:string;
  duration:string;
  language:string;
}

export const geminiAiResponseRecommendations = async (
  summary: string,
  songDataDetails: string
): Promise<AiRecommendation[] | null> => {

  if (!songDataDetails.length) {
    console.log("songDataDetails not found");
    return null;
  }
  try {
    const prompt = `
          You are a music recommendation engine.
            Return ONLY valid JSON.

          USER LISTENING SUMMARY:
        ${summary}

        CANDIDATE SONGS:
        ${songDataDetails}

        Return JSON in this format:
      [
        {
          "song_title": "string",
          "song_index": number,
          "score": number,
          "reason": "short explanation"
        }`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) return null;

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
    console.error("Gemini recommendation error:", err);
    return null;
  }
};


//for uploading songs ==----==>

export const songDetailsFromAi = async (songName: string, artistName: string):Promise<songDetailsData|null> => {

  if (!songName || !artistName) {
    throw new Error("song name or artist name not specified")
  }

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
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    });

    const data = response.text;

    if(!data){
      return null;
    }

    const parsedData:songDetailsData= JSON.parse(data);

    return parsedData;

  } catch (error) {
    console.error("Gemini recommendation error:", error);
    return null;
  }
}