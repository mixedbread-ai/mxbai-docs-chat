import "server-only";

import Mixedbread from "@mixedbread/sdk";
import { env } from "@/env";

export const mxbai = new Mixedbread({
  apiKey: env.MXBAI_API_KEY,
});
