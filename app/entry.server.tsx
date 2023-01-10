import { inline, install } from "@twind/core";
import { renderToString } from "react-dom/server";
import config from "../twind.config.ts";

// activate twind for using it to style the index.html
install(config);

/** this will not be hydrated */
function Document(props: {
  clientBundleUrl: string;
  reloadScriptUrl?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        {props.reloadScriptUrl && <script src={props.reloadScriptUrl} />}
        <title>Relaxed SPA</title>
      </head>
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
        <div id="root"></div>
        <script src={props.clientBundleUrl}></script>
      </body>
    </html>
  );
}

/** creates the initial HTML */
export function render(clientBundleUrl: string, reloadScriptUrl?: string) {
  const html = renderToString(
    <Document
      clientBundleUrl={clientBundleUrl}
      reloadScriptUrl={reloadScriptUrl}
    />
  );
  // inline initial styles
  return inline(html);
}
