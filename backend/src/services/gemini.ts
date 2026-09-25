import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing from backend/.env");
}

const ai = new GoogleGenAI({
  apiKey,
});

const MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.6-flash",
];

const RETRIES_FOR_503 = 1;

function getErrorStatus(error: unknown): number | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error
  ) {
    const status = (error as { status?: unknown }).status;

    return typeof status === "number" ? status : undefined;
  }

  return undefined;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithModel(
  model: string,
  prompt: string
): Promise<string> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= RETRIES_FOR_503; attempt++) {
    try {
      if (attempt > 0) {
        console.log(
          `Retrying ${model} after temporary failure...`
        );

        await delay(2000);
      }

      console.log(`Trying Gemini model: ${model}`);

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      console.log(`Gemini model succeeded: ${model}`);

      return response.text ?? "";
    } catch (error) {
      lastError = error;

      const status = getErrorStatus(error);

      console.error(
        `Model ${model} failed with status ${status ?? "unknown"}:`,
        getErrorMessage(error)
      );

      // 429 = quota/rate limit.
      // Do not retry the same model unnecessarily.
      if (status === 429) {
        break;
      }

      // Retry only temporary 503 failures.
      if (status !== 503) {
        break;
      }
    }
  }

  throw (
    lastError ??
    new Error(`Gemini model ${model} failed`)
  );
}

export async function askGemini(
  prompt: string
): Promise<string> {
  let lastError: unknown;

  for (const model of MODELS) {
    try {
      return await generateWithModel(
        model,
        prompt
      );
    } catch (error) {
      lastError = error;

      const status = getErrorStatus(error);

      // Move to the next model for 429/503.
      if (status === 429 || status === 503) {
        continue;
      }

      throw error;
    }
  }

  throw (
    lastError ??
    new Error("All Gemini models failed")
  );
}

export interface GroundedGeminiResult {
  text: string;
  sources: Array<{
    title: string;
    url: string;
  }>;
  usedFallback: boolean;
}

export async function askGeminiWithSearch(
  prompt: string
): Promise<GroundedGeminiResult> {
  let lastError: unknown;

  for (const model of MODELS) {
    try {
      console.log(
        `Trying Gemini web-grounded model: ${model}`
      );

      const response =
        await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            tools: [
              {
                googleSearch: {},
              },
            ],
          },
        });

      const sources: Array<{
        title: string;
        url: string;
      }> = [];

      const groundingChunks =
        response.candidates?.[0]?.groundingMetadata
          ?.groundingChunks ?? [];

      for (const chunk of groundingChunks) {
        const web = chunk.web;

        if (web?.uri) {
          const alreadyAdded = sources.some(
            (source) => source.url === web.uri
          );

          if (!alreadyAdded) {
            sources.push({
              title: web.title ?? "Web source",
              url: web.uri,
            });
          }
        }
      }

      console.log(
        `Gemini web search succeeded: ${model}`
      );

      return {
        text: response.text ?? "",
        sources,
        usedFallback: false,
      };
    } catch (error) {
      lastError = error;

      const status = getErrorStatus(error);

      console.error(
        `Grounded model ${model} failed with status ${
          status ?? "unknown"
        }:`,
        getErrorMessage(error)
      );

      if (status !== 429 && status !== 503) {
        break;
      }
    }
  }

  /*
   * WEB SEARCH FALLBACK
   *
   * If Google Search grounding is unavailable because of quota
   * or a temporary service problem, continue the verification
   * pipeline using normal Gemini reasoning.
   *
   * We explicitly tell the fallback model that no web search
   * was performed, so it must NOT invent sources or pretend
   * that information came from retrieved web results.
   */

  console.warn(
    "Web grounding unavailable. Falling back to normal Gemini reasoning."
  );

  const fallbackPrompt = `
${prompt}

IMPORTANT FALLBACK INSTRUCTION:

Web search/grounding was unavailable for this request.

You MUST NOT claim that you searched the web.
You MUST NOT invent URLs, source names, studies, quotations,
statistics, or retrieved evidence.
Do not describe information as "found by Google Search".

Instead:
- Use your general model knowledge only.
- Clearly state that live web verification was unavailable.
- Treat the result as preliminary reasoning rather than
  live source verification.
`;

  try {
    const fallbackText = await askGemini(fallbackPrompt);

    return {
      text: fallbackText,
      sources: [],
      usedFallback: true,
    };
  } catch (fallbackError) {
    console.error(
      "Gemini fallback also failed:",
      getErrorMessage(fallbackError)
    );

    throw (
      lastError ??
      fallbackError ??
      new Error("Web-grounded Gemini and fallback Gemini both failed")
    );
  }
}