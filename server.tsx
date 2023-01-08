import { inline, install } from "@twind/core";
import { nanoid } from "nanoid";
import * as ReactDOMServer from "react-dom/server";
import { serveFile } from "std/http/file_server.ts";
import { serve } from "std/http/server.ts";
import { handleTrpcRequests } from "./api/trpc.ts";
import config from "./twind.config.ts";
import { bundle } from "./utils/bundle.ts";
import { returnReloadEventStream, returnReloadScript } from "./utils/reload.ts";

// activate twind for using it to style the index.html
install(config);

// Env var is only set in prod (on Deploy).;
const IS_DEV = typeof Deno.env.get("DENO_DEPLOYMENT_ID") !== "string";

const RELOAD_SCRIPT_URL = "/_reload.js";
const RELOAD_URL = "/_reload";

const CLIENT_ENTRY_POINT = "./app/main.tsx";
const CLIENT_BUNDLE_PATH = `/bundle-${nanoid()}.js`;

/** this will not be hydrated */
function Index() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        {IS_DEV && <script src={RELOAD_SCRIPT_URL} />}
        <title>Relaxed SPA</title>
      </head>
      <body className="bg-gray-50">
        <div id="root"></div>
        <script src={CLIENT_BUNDLE_PATH}></script>
      </body>
    </html>
  );
}

/** start preparing the app bundle on server start */
const appBundle = bundle(
  CLIENT_ENTRY_POINT,
  new URL("./import_map.json", import.meta.url),
);

function indexHTMLResponse() {
  return new Response(
    inline(`<!DOCTYPE html>${
      ReactDOMServer.renderToString(
        <Index />,
      )
    }`),
    { headers: { "Content-Type": "text/html" } },
  );
}

serve(async (req) => {
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
  // serve the index.html file
  if (path === "/" || path === "/index.html") {
    return indexHTMLResponse();
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
  return indexHTMLResponse();
});
