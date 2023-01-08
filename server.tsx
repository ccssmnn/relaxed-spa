import { nanoid } from "nanoid";
import * as ReactDOMServer from "react-dom/server";
import { serveFile } from "std/http/file_server.ts";
import { serve } from "std/http/server.ts";
import { handleAPIRequests } from "./api/mod.ts";
import { bundle } from "./utils/bundle.ts";

const CLIENT_ENTRY_POINT = "./app/main.tsx";
const CLIENT_BUNDLE_PATH = `/bundle-${nanoid()}.js`;

/** this will not be hydrated */
function Index() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
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
    ReactDOMServer.renderToString(
      <Index />,
    ),
    {
      headers: {
        "Content-Type": "text/html",
      },
    },
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
  if (path.startsWith("/api")) {
    return handleAPIRequests(req);
  }
  // serve the index.html file
  if (path === "/" || path === "/index.html") {
    return indexHTMLResponse();
  }
  // try to serve the static files, fall back to index.html
  const res = await serveFile(req, `./public${path}`);
  if (res.status !== 404) {
    return res;
  }
  // fall back to serving the index.html and let the client-side router handle it
  return indexHTMLResponse();
});
