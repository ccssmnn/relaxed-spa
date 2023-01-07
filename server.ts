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
  const path = new URL(req.url).pathname;
  if (path === `/${BUNDLE_NAME}`) {
    return new Response(appBundle, {
      headers: {
        "Content-Type": "application/javascript",
      },
    });
  }
  if (path.startsWith("/api")) {
    return apiHandler(req);
  }
  if (path === "/" || path === "/index.html") {
    return serveFile(req, "./index.html");
  }
  const res = await serveFile(req, `./public${path}`);
  if (res.status === 404) {
    return serveFile(req, "./index.html");
  }
  return res;
});
