import type { ReactNode } from "react";
import {
  ActionFunctionArgs,
  createBrowserRouter,
  createRoutesFromElements,
  Form,
  Link,
  Route,
  useActionData,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "react-router-dom";
import { z } from "zod";

// loader receives data when react-router is prerendering the page
async function loader() {
  const res = await fetch("/api/count");
  const json = await res.json();
  const { count } = z.object({ count: z.number() }).parse(json);
  return { count };
}

// actions are executed when react-router forms are submitted, they
// trigger reloading of the loaders since they are used for mutations
async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "increment") {
    const { ok } = await fetch("/api/increment", { method: "POST" });
    if (!ok) return { error: "Could not increment" };
  }
  if (intent === "decrement") {
    const { ok } = await fetch("/api/decrement", { method: "POST" });
    if (!ok) return { error: "Could not decrement" };
  }
  return null;
}

function ExternalLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <a
      href={to}
      className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-500 dark:hover:text-indigo-200"
    >
      {children}
    </a>
  );
}

function App() {
  // receive data from loader
  const data = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const actionData = useActionData() as Awaited<ReturnType<typeof action>>;
  const error = actionData?.error;

  // get access to react-router navigations
  const navigation = useNavigation();

  // access current submission for loading states
  const incrementing = navigation.state !== "idle" &&
    navigation.formData?.get("intent") === "increment";
  const decrementing = navigation.state !== "idle" &&
    navigation.formData?.get("intent") === "decrement";
  const loading = incrementing || decrementing;

  // no useState / useEffect needed
  return (
    <div className="px-3 max-w-xl space-y-6 py-6 mx-auto text-center">
      <img
        src="/public/favicon.ico"
        className="mx-auto w-48 h-48"
        alt="A cute white dinosaur on dark background looking to the left"
      />
      <h1 className="font-bold text-3xl">Super Relaxed SPA</h1>
      <p>The current count (on the server) is {data.count}</p>
      {error && <p className="text-red-500">Error: {error}</p>}
      <Form method="post">
        <button
          className="px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-gray-50 mr-3"
          name="intent"
          value="increment"
          type="submit"
          disabled={loading}
        >
          {incrementing ? "Loading..." : "Increment"}
        </button>
        <button
          className="px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-gray-50"
          name="intent"
          value="decrement"
          type="submit"
          disabled={loading}
        >
          {decrementing ? "Loading..." : "Decrement"}
        </button>
      </Form>
      <div className="border-t border-gray-900 dark:border-gray-50" />
      <p>
        Modern tooling and web standards are so good. You might not need a
        framework to build a great SPA. Bring your own everything.
      </p>
      <h2 className="text-2xl font-semibold">What is going on here?</h2>
      <p>
        This is a React SPA with API Routes, written in TypeScript and deployed
        without a build step.
      </p>
      <ul className="list-disc text-left pl-6">
        <li>
          powered by <ExternalLink to="https://deno.com">Deno</ExternalLink>
        </li>
        <li>
          using{" "}
          <ExternalLink to="https://reactrouter.com">
            React Router's
          </ExternalLink>{" "}
          new data apis
        </li>
        <li>
          using TailwindCSS-like utility classes powered by{" "}
          <ExternalLink to="https://twind.style">twind</ExternalLink>
        </li>
        <li>
          while the client bundle is built on the fly with{" "}
          <ExternalLink to="https://esbuild.github.io">esbuild</ExternalLink>
        </li>
      </ul>
      <p>
        Checkout the source code on GitHub{" "}
        <ExternalLink to="https://github.com/ccssmnn/relaxed-spa">
          ccssmnn/relaxed-spa
        </ExternalLink>
      </p>
    </div>
  );
}

function NotFoundElement() {
  return (
    <div className="px-3 max-w-xl space-y-6 py-6 mx-auto text-center">
      <img src="/favicon.ico" className="mx-auto" />
      <h1 className="font-bold text-3xl">404 - Not Found</h1>
      <p>
        Go back{" "}
        <Link
          to="/"
          className="text-indigo-600 underline hover:text-indigo-500"
        >
          Home
        </Link>
      </p>
    </div>
  );
}

function ErrorElement() {
  const error = useRouteError();
  console.error(error);
  return (
    <div className="px-3 max-w-xl space-y-6 py-6 mx-auto text-center">
      <img src="/favicon.ico" className="mx-auto" />
      <h1 className="font-bold text-3xl text-red-600">
        Ups, something went wrong
      </h1>
      <p>
        Go back{" "}
        <Link
          to="/"
          className="text-indigo-600 underline hover:text-indigo-500"
        >
          Home
        </Link>
      </p>
    </div>
  );
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorElement />}>
      <Route path="/" element={<App />} loader={loader} action={action} />
      <Route path="*" element={<NotFoundElement />} />
    </Route>,
  ),
);
