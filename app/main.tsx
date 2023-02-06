import {
  ActionFunctionArgs,
  createBrowserRouter,
  createRoutesFromElements,
  Form,
  Route,
  useActionData,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "react-router-dom";
import { z } from "zod";
import {
  Button,
  Container,
  Divider,
  ExternalLink,
  H1,
  H2,
  Img,
  Li,
  Link,
  P,
  Ul,
} from "./ui.tsx";

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

function App() {
  // receive data from loader
  const data = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const actionData = useActionData() as Awaited<ReturnType<typeof action>>;
  const error = actionData?.error;

  // get access to react-router navigations
  const navigation = useNavigation();

  // access current submission for loading states
  const incrementing =
    navigation.state !== "idle" &&
    navigation.formData?.get("intent") === "increment";
  const decrementing =
    navigation.state !== "idle" &&
    navigation.formData?.get("intent") === "decrement";
  const loading = incrementing || decrementing;

  // no useState / useEffect needed
  return (
    <Container>
      <Img
        src="/public/favicon.ico"
        css={{
          width: "$48",
          height: "$48",
          mx: "$auto",
        }}
        alt="A cute white dinosaur on dark background looking to the left"
      />
      <H1>Super Relaxed SPA</H1>
      <P>The current count (on the server) is {data.count}</P>
      {error && (
        <P className="text-red-500" css={{ color: "$red500" }}>
          Error: {error}
        </P>
      )}
      <Form method="post">
        <Button
          name="intent"
          value="increment"
          type="submit"
          disabled={loading}
        >
          {incrementing ? "Loading..." : "Increment"}
        </Button>
        <Button
          name="intent"
          value="decrement"
          type="submit"
          disabled={loading}
        >
          {decrementing ? "Loading..." : "Decrement"}
        </Button>
      </Form>
      <Divider />
      <P>
        Modern tooling and web standards are so good. You might not need a
        framework to build a great SPA. Bring your own everything.
      </P>
      <H2>What is going on here?</H2>
      <P>
        This is a React SPA with API Routes, written in TypeScript and deployed
        without a build step.
      </P>
      <Ul css={{ listStyleType: "disc", paddingLeft: "$6" }}>
        <Li>
          powered by <ExternalLink href="https://deno.com">Deno</ExternalLink>
        </Li>
        <Li>
          using{" "}
          <ExternalLink href="https://reactrouter.com">
            React Router's
          </ExternalLink>{" "}
          new data apis
        </Li>
        <Li>
          using TailwindCSS-like utility classes powered by{" "}
          <ExternalLink href="https://twind.style">twind</ExternalLink>
        </Li>
        <Li>
          while the client bundle is built on the fly with{" "}
          <ExternalLink href="https://esbuild.github.io">esbuild</ExternalLink>
        </Li>
      </Ul>
      <P>
        Checkout the source code on GitHub{" "}
        <ExternalLink href="https://github.com/ccssmnn/relaxed-spa">
          ccssmnn/relaxed-spa
        </ExternalLink>
      </P>
    </Container>
  );
}

function NotFoundElement() {
  return (
    <Container>
      <Img
        src="/public/favicon.ico"
        css={{
          width: "$48",
          height: "$48",
          mx: "$auto",
        }}
        alt="A cute white dinosaur on dark background looking to the left"
      />
      <H1>404 - Not Found</H1>
      <P>
        Go back <Link to="/">Home</Link>
      </P>
    </Container>
  );
}

function ErrorElement() {
  const error = useRouteError();
  console.error(error);
  return (
    <Container>
      <Img
        src="/public/favicon.ico"
        css={{
          width: "$48",
          height: "$48",
          mx: "$auto",
        }}
        alt="A cute white dinosaur on dark background looking to the left"
      />
      <H1>Oops, something went wrong</H1>
      <P>
        Go back <Link to="/">Home</Link>
      </P>
    </Container>
  );
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorElement />}>
      <Route path="/" element={<App />} loader={loader} action={action} />
      <Route path="*" element={<NotFoundElement />} />
    </Route>
  )
);
