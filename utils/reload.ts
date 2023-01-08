/**
 * This part of the code is based on the way `fresh` is live reloading during
 * development.
 * See https://github.com/denoland/fresh/blob/main/src/server/context.ts#L385
 */

const BUILD_ID = crypto.randomUUID();

/**
 * returns a script that creates an eventlistener on reloadUrl and trigger a
 * reload when the build id changes. The build id changes on server restart.
 */
export function returnReloadScript(reloadUrl: string) {
  const js = `
new EventSource("${reloadUrl}")
  .addEventListener("message", function listener(e) {
    if (e.data !== "${BUILD_ID}") {
      this.removeEventListener('message', listener);
      location.reload();
    } 
  });
`;
  return new Response(js, {
    headers: {
      "content-type": "application/javascript; charset=utf-8",
    },
  });
}

/**
 * returns an event stream that sends the build id every second. The reload
 * script will compare the build id with the one it has and reload if they
 * differ.
 */
export function returnReloadEventStream() {
  let timerId: number | undefined = undefined;
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(`data: ${BUILD_ID}\nretry: 100\n\n`);
      timerId = setInterval(() => {
        controller.enqueue(`data: ${BUILD_ID}\n\n`);
      }, 1000);
    },
    cancel() {
      if (timerId !== undefined) {
        clearInterval(timerId);
      }
    },
  });
  return new Response(body.pipeThrough(new TextEncoderStream()), {
    headers: {
      "content-type": "text/event-stream",
    },
  });
}
