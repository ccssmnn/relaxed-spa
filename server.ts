import { serveFile } from "std/http/file_server.ts";
import { serve } from "std/http/server.ts";
import { apiHandler } from "./api/mod.ts";
import { bundle } from "./utils/bundle.ts";

const BUNDLE_NAME = "app/main.tsx";

/** generate the app bundle on server start */
const appBundle = await bundle(
  `./${BUNDLE_NAME}`,
  new URL("./import_map.json", import.meta.url),
);

serve(async (req) => {
  // check the request path
  const path = new URL(req.url).pathname;
  // return the bundle when the path matches
  if (path === `/${BUNDLE_NAME}`) {
    return new Response(appBundle, {
      headers: {
        "Content-Type": "application/javascript",
      },
    });
  }
  // forward the request to the api handler
  if (path.startsWith("/api")) {
    return apiHandler(req);
  }
  // serve the index.html file
  if (path === "/" || path === "/index.html") {
    return serveFile(req, "./index.html");
  }
  // now try to serve the static files, fall back to index.html
  const res = await serveFile(req, `./public${path}`);
  if (res.status === 404) {
    return serveFile(req, "./index.html");
  }
  return res;
});
