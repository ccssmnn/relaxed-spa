import { renderToString } from "react-dom/server";
import { getCssText } from "./stitches.config.ts";
import { Body } from "./ui.tsx";

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
        <link rel="stylesheet" href="/public/preflight.css" />
        <style
          id="stitches"
          dangerouslySetInnerHTML={{ __html: getCssText() }}
        />
      </head>
      <Body
        css={{
          "@dark": {
            backgroundColor: "$gray900",
            color: "$gray100",
          },
        }}
      >
        <div id="root"></div>
        <script src={props.clientBundleUrl}></script>
      </Body>
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
  return html;
}
