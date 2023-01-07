import { initTRPC } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { z } from "zod";

const t = initTRPC.create();

let count = 0;

const appRouter = t.router({
  getCount: t.procedure.input(() => {}).query(() => {
    return { count };
  }),
  increment: t.procedure.input(z.object({ amount: z.number().optional() }))
    .mutation((req) => {
      count += req.input.amount ?? 1;
    }),
  decrement: t.procedure.input(z.object({ amount: z.number().optional() }))
    .mutation((req) => {
      count -= req.input.amount ?? 1;
    }),
});

export type AppRouter = typeof appRouter;

/**
 * serves TRPC requests from /api
 */
export function apiHandler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api",
    req,
    router: appRouter,
    createContext: () => ({}),
  });
}
