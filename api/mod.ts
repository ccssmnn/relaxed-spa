import { initTRPC } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Hono } from "hono/mod.ts";
import { z } from "zod";

const t = initTRPC.create();

// count is our server side state
let count = 0;

/**
 * the trpc route has methods for receiving and mutating the count
 */
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

// exporting the router type allows using the API types in the client
export type AppRouter = typeof appRouter;

const app = new Hono();

app.all("/trpc/*", (c) => {
  return fetchRequestHandler({
    req: new Request(c.req),
    endpoint: "/api/trpc",
    router: appRouter,
    createContext: () => ({}),
  });
});

export const api = app;
