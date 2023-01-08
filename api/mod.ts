import { initTRPC } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
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

/** return responses to fetch requests */
export async function handleAPIRequests(req: Request) {
  const res = await fetchRequestHandler({
    endpoint: "/api",
    req,
    router: appRouter,
    createContext: () => ({}),
  });
  if (res.status === 404) {
    return new Response("Not found", { status: 404 });
  }
  return res;
}
