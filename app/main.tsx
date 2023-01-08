import install from "@twind/with-react";
import React, { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import {
  ActionFunctionArgs,
  createBrowserRouter,
  Form,
  Link,
  RouterProvider,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import twindConfig from "../twind.config.ts";
import { trpc } from "./trpc.ts";

// initialize twind
install(twindConfig);

// loader receives data when react-router is prerendering the page
async function loader() {
  const res = await trpc.getCount.query();
  return { count: res.count };
}

// actions are executed when react-router forms are submitted, they
// trigger reloading of the loaders since they are used for mutations
async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "increment") {
    await trpc.increment.mutate({ amount: 1 });
  }
  if (intent === "decrement") {
    await trpc.decrement.mutate({ amount: 1 });
  }
  return null;
}

function ExternalLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <a href={to} className="text-indigo-600 underline hover:text-indigo-500">
      {children}
    </a>
  );
}

function App() {
  // receive data from loader
  const data = useLoaderData() as Awaited<ReturnType<typeof loader>>;

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
        src="/favicon.ico"
        className="mx-auto w-48 h-48"
        alt="A cute white dinosaur on dark background looking to the left"
      />
      <h1 className="font-bold text-3xl">Super Relaxed SPA</h1>
      <p>The current count (on the server) is {data.count}</p>
      <Form method="post">
        <button
          className="px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 mr-3"
          name="intent"
          value="increment"
          type="submit"
          disabled={loading}
        >
          {incrementing ? "Loading..." : "Increment"}
        </button>
        <button
          className="px-2 py-1 rounded-md bg-gray-200 text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          name="intent"
          value="decrement"
          type="submit"
          disabled={loading}
        >
          {decrementing ? "Loading..." : "Decrement"}
        </button>
      </Form>
      <div className="border-t border-gray-900" />
      <h2 className="text-2xl font-semibold">What is going on here?</h2>
      <p>Your seeing a React Single Page Application with server side state:</p>
      <ul className="list-disc text-left pl-6">
        <li>
          powered by <ExternalLink to="https://deno.com">Deno</ExternalLink>
          {" "}
          deployed on{" "}
          <ExternalLink to="https://deno.com/deploy">Deno Deploy</ExternalLink>
        </li>
        <li>
          using{" "}
          <ExternalLink to="https://reactrouter.com">
            React Router's
          </ExternalLink>{" "}
          new data apis
        </li>
        <li>
          with an API server backed by{" "}
          <ExternalLink to="https://trpc.io">trpc</ExternalLink>
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

function NotFound() {
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    action,
    loader,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
