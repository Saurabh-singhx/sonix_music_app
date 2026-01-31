import ai from "../config/gemini.js";

export type AiRecommendation = {
  song_title: string;
  song_index: number;
  score: number;
  reason: string;
};

export const geminiAiResponseRecommendations = async (
  summary: string,
  songDataDetails: string
): Promise<AiRecommendation[] | null> => {

  if(!songDataDetails.length){
    console.log("songDataDetails not found");
    return null;
  }
  console.log(songDataDetails)
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
  }
]
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // ✅ real, supported model
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
