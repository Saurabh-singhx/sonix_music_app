import openai from "../config/openai.js";

export type AiRecommendation = {
  song_title: string;
  song_index: number;
  score: number;
  reason: string;
};

export const aiResponseRecommendations = async (
  summary: string,
  songDataDetails: string
): Promise<AiRecommendation[] | null> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `
You are a music recommendation engine.
You MUST return valid JSON only.
Do not add explanations outside JSON.
`
        },
        {
          role: "user",
          content: `
USER LISTENING SUMMARY:
${summary}

CANDIDATE SONGS:
${songDataDetails}

TASK:
Select the best matching songs for the user.
Rank them by relevance.
Return ONLY valid JSON in the following format:

[
  {
    "song_title": "string",
    "song_index":number,
    "score":number,
    "reason": "short explanation"
  }
    
]
`
        }
      ]
    });

    const rawContent = response.choices[0]?.message?.content;
    if (!rawContent) return null;

    const cleaned = rawContent
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    // Basic validation
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

  } catch (error) {
    console.error("AI recommendation error:", error);
    return null;
  }
};
