import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../api/mod.ts";

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api",
    }),
  ],
});
