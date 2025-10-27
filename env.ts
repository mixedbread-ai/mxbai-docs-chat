import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const env = createEnv({
  server: {
    MXBAI_API_KEY: z.string().startsWith("mxb_"),
    MXBAI_STORE_ID: z.string().min(1),
    GEMINI_API_KEY: z.string().min(1),
    GITHUB_TOKEN: z.string().min(1),
  },
  runtimeEnv: {
    MXBAI_API_KEY: process.env.MXBAI_API_KEY,
    MXBAI_STORE_ID: process.env.MXBAI_STORE_ID,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  },
});
