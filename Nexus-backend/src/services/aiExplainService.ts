import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config(); 

export type AiExplainResult = {
  summary: string;
  keyPoints: string[];
  relatedTopics: string[];
  disclaimer: string;
};

const aiExplainCache = new Map<
  string,
  { result: AiExplainResult; expiresAt: number }
>();
const AI_CACHE_TTL_MS = 1000 * 60 * 15;

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function getAiExplanation(query: string): Promise<{
  result: AiExplainResult;
  cached: boolean;
}> {
  const normalizedQuery = query.trim();
  const cacheKey = normalizedQuery.toLowerCase();
  const now = Date.now();
  const cachedResult = aiExplainCache.get(cacheKey);

  if (cachedResult && cachedResult.expiresAt > now) {
    return { result: cachedResult.result, cached: true };
  }

  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured on server");
  }

  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const prompt = [
    "You are an educational assistant inside a productivity app.",
    `Explain this topic clearly for a beginner: "${normalizedQuery}".`,
    "Return only valid JSON with this exact shape:",
    '{"summary":"string","keyPoints":["string"],"relatedTopics":["string"],"disclaimer":"string"}',
    "Rules:",
    "- summary: 2 to 4 sentences",
    "- keyPoints: 3 to 6 short bullet-style strings",
    "- relatedTopics: 3 to 6 strings",
    "- disclaimer: 1 short sentence mentioning info can be incomplete",
    "- No markdown, no code fences, no extra keys",
  ].join("\n");

  const completion = await groq.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
    max_tokens: 500,
    response_format: { type: "json_object" },
  });

  const textResponse = completion.choices[0]?.message?.content || "";

  if (!textResponse) {
    throw new Error("AI provider returned an empty response");
  }

  let parsedResult: AiExplainResult;
  try {
    const obj = JSON.parse(textResponse);
    parsedResult = {
      summary:
        typeof obj.summary === "string"
          ? obj.summary
          : `"${normalizedQuery}" is a topic worth exploring.`,
      keyPoints: Array.isArray(obj.keyPoints)
        ? obj.keyPoints
            .filter((x: unknown) => typeof x === "string")
            .slice(0, 6)
        : [],
      relatedTopics: Array.isArray(obj.relatedTopics)
        ? obj.relatedTopics
            .filter((x: unknown) => typeof x === "string")
            .slice(0, 6)
        : [],
      disclaimer:
        typeof obj.disclaimer === "string"
          ? obj.disclaimer
          : "AI-generated summary can be incomplete. Verify important details.",
    };
  } catch {
    parsedResult = {
      summary: textResponse.slice(0, 500),
      keyPoints: [],
      relatedTopics: [],
      disclaimer:
        "AI-generated summary can be incomplete. Verify important details.",
    };
  }

  aiExplainCache.set(cacheKey, {
    result: parsedResult,
    expiresAt: now + AI_CACHE_TTL_MS,
  });

  return { result: parsedResult, cached: false };
}
