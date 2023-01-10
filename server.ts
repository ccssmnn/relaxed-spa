import { logger, serveStatic } from "hono/middleware.ts";
import { Hono } from "hono/mod.ts";
import { serve } from "std/http/server.ts";
import { api } from "./api/mod.ts";
import { render } from "./app/entry.server.tsx";
import { createBundle } from "./utils/bundle.ts";
import { returnReloadEventStream, returnReloadScript } from "./utils/reload.ts";

// Check for a environmentvariable that is only present in prod.
// here: DENO_DEPLOYMENT_ID is only set in on Deploy;
const IS_DEV = typeof Deno.env.get("DENO_DEPLOYMENT_ID") !== "string";

/** start preparing the app bundle on server start */
const clientBundle = createBundle(
  new URL("./app/entry.client.tsx", import.meta.url),
  new URL("./import_map.json", import.meta.url),
  IS_DEV,
);

const RELOAD_SCRIPT_URL = "/_reload.js";
const RELOAD_URL = "/_reload";
const CLIENT_BUNDLE_PATH = `/bundle-${crypto.randomUUID()}.js`;

const app = new Hono();

app.use("*", logger((...args) => console.log(new Date(), ...args)));
app.use("/public/*", serveStatic({ root: "./" }));

app.get(CLIENT_BUNDLE_PATH, async () =>
  new Response(await clientBundle, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=604800, immutable",
    },
  }));

if (IS_DEV) {
  app.get(RELOAD_URL, () => returnReloadEventStream());
  app.get(RELOAD_SCRIPT_URL, () => returnReloadScript(RELOAD_URL));
}

app.route("/api", api);

app.get("*", () =>
  new Response(
    render(CLIENT_BUNDLE_PATH, IS_DEV ? RELOAD_SCRIPT_URL : undefined),
    { headers: { "Content-Type": "text/html" } },
  ));

serve(app.fetch, {
  onListen: ({ hostname, port }) =>
    console.log(new Date(), `Listening on http://${hostname}:${port}`),
});
