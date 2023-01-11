import { Hono } from "hono/mod.ts";

export const api = new Hono();

// count is our server side state
let count = 0;

api.get("/count", (c) => c.json({ count }));
api.post("/increment", (c) => {
  count++;
  return c.json({ count });
});
api.post("/decrement", (c) => {
  count--;
  return c.json({ count });
});
