import { serveFile } from "std/http/file_server.ts";
import { serve } from "std/http/server.ts";
import { handleTrpcRequests } from "./api/trpc.ts";
import { render } from "./app/entry.server.tsx";
import { createBundle } from "./utils/bundle.ts";
import { returnReloadEventStream, returnReloadScript } from "./utils/reload.ts";

// Env var is only set in prod (on Deploy).;
const IS_DEV = typeof Deno.env.get("DENO_DEPLOYMENT_ID") !== "string";

const RELOAD_SCRIPT_URL = "/_reload.js";
const RELOAD_URL = "/_reload";

const CLIENT_BUNDLE_PATH = `/bundle-${crypto.randomUUID()}.js`;

/** start preparing the app bundle on server start */
const appBundle = createBundle(
  new URL("./app/entry.client.tsx", import.meta.url),
  new URL("./import_map.json", import.meta.url),
);

serve(
  async (req) => {
    // check the request path
    const path = new URL(req.url).pathname;
    // return the bundle when the path matches
    if (path === CLIENT_BUNDLE_PATH) {
      return new Response(await appBundle, {
        headers: {
          "Content-Type": "application/javascript",
          "Cache-Control": "public, max-age=604800, immutable",
        },
      });
    }
    // forward the request to the api handler
    if (path.startsWith("/trpc")) {
      return handleTrpcRequests("/trpc", req);
    }
    if (IS_DEV) {
      if (path === RELOAD_URL) {
        return returnReloadEventStream();
      }
      if (path === RELOAD_SCRIPT_URL) {
        return returnReloadScript(RELOAD_URL);
      }
    }
    // try to serve the static files, fall back to index.html
    const res = await serveFile(req, `./public${path}`);
    if (res.status !== 404) {
      return res;
    }
    // fall back to serving the index.html and let the client-side router handle it
    return new Response(
      render(CLIENT_BUNDLE_PATH, IS_DEV ? RELOAD_SCRIPT_URL : undefined),
      { headers: { "Content-Type": "text/html" } },
    );
  },
  {
    onListen: ({ hostname, port }) =>
      console.log(new Date(), `Listening on http://${hostname}:${port}`),
  },
);
