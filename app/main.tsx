import install from "@twind/with-react";
import React from "react";
import { createRoot } from "react-dom/client";
import {
  ActionFunctionArgs,
  createBrowserRouter,
  Form,
  RouterProvider,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import twindConfig from "../twind.config.ts";
import { trpc } from "./trpc.ts";

// You must call install at least once, but can call it multiple times
install(twindConfig);

async function loader() {
  const res = await trpc.getCount.query();
  return { count: res.count };
}

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

function App() {
  const data = useLoaderData() as { count: number };
  const navigation = useNavigation();
  const incrementing = navigation.state !== "idle" &&
    navigation.formData?.get("intent") === "increment";
  const decrementing = navigation.state !== "idle" &&
    navigation.formData?.get("intent") === "decrement";
  const loading = incrementing || decrementing;
  return (
    <div className="px-3 max-w-xl space-y-6 py-6 mx-auto text-center">
      <img src="/favicon.ico" className="mx-auto" />
      <h1 className="font-bold text-3xl">Relaxed SPA</h1>
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
      <ul className="list-disc text-left">
        <li>powered by Deno</li>
        <li>with an API server backed by trpc</li>
        <li>using utility classes powered by twind</li>
        <li>built on the fly with esbuild</li>
      </ul>
    </div>
  );
}

function NotFound() {
  return (
    <div className="px-3 max-w-xl space-y-6 py-6 mx-auto text-center">
      <img src="/favicon.ico" className="mx-auto" />
      <h1 className="font-bold text-3xl">404 - Not Found</h1>
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
