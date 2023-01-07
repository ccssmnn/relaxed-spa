import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../api/mod.ts";

/** initialize trpc client with types from the API */
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api",
    }),
  ],
});
