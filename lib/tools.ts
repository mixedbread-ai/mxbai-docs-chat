import type {
  ScoredAudioURLInputChunk,
  ScoredImageURLInputChunk,
  ScoredTextInputChunk,
  ScoredVideoURLInputChunk,
} from "@mixedbread/sdk/resources";
import { z } from "zod";
import { mxbai } from "@/lib/mxbai";

type ScoredChunk =
  | ScoredTextInputChunk
  | ScoredImageURLInputChunk
  | ScoredAudioURLInputChunk
  | ScoredVideoURLInputChunk;

function getChunkText(chunk: ScoredChunk): string {
  if ("text" in chunk && chunk.text) {
    return chunk.text;
  }
  if ("transcription" in chunk && chunk.transcription) {
    return chunk.transcription;
  }
  if ("ocr_text" in chunk && chunk.ocr_text) {
    return chunk.ocr_text;
  }
  if ("summary" in chunk && chunk.summary) {
    return chunk.summary;
  }
  return "Non-text content";
}

export const searchStoreTool = {
  description: "Search for relevant information using vector search",
  inputSchema: z.object({
    query: z.string().describe("The search query"),
    topK: z
      .number()
      .optional()
      .default(10)
      .describe("Number of results to return"),
  }),
  execute: async ({
    query,
    topK = 3,
  }: {
    query: string;
    topK: number;
    returnMetadata: boolean;
  }) => {
    try {
      const storeId = process.env.MXBAI_STORE_ID;

      if (!storeId) {
        return {
          error: "No store ID provided and environment not configured",
        };
      }

      const res = await mxbai.stores.search({
        query,
        store_identifiers: [storeId],
        top_k: topK,
        search_options: {
          return_metadata: true,
        },
      });

      const results = res.data.map((chunk: ScoredChunk) => {
        const metadata = {
          ...(chunk.metadata || {}),
          ...chunk.generated_metadata,
        };

        return {
          score: chunk.score,
          filename: chunk.filename,
          text: getChunkText(chunk),
          metadata,
        };
      });

      return {
        results,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Search failed",
      };
    }
  },
};
