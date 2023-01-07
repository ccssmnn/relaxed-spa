# Relaxed SPA

Lets build a modern full stack SPA, but skip some tooling.

## Tools

- Deno is the No-Build, No-Install, Fast and Secure Typescript and JSX
  experience
- React + React Router (>= 6.4) are a charm for client side data loading (Remix
  vibes in your SPA)
- twind enables TailwindCSS-style utility classes without a build step
- trpc + zod gets us the typesafe API

## Goals

- avoid a build step
- ready for Deno Deploy
- keep full control over the server (as few abstractions as possible)
- keep dev-experience as close to production experience as possible

## Advantages

We can skip lots of tooling & vscode-extensions

- no install step
- no build step (ultra fast deployments)
- write the scripts you may need in typescript & execute in deno
- just-in-time client bundle generation (~~vite~~ ➡️ esbuild)
- Tailwind-in-JS (~~postcss~~)
- Built in testing
- Built in TypeScript support (~~tsc~~)
- Built in linting (~~eslint~~ + vscode extension)
- Built in formatter (~~prettier~~ + vscode extension)
- Built in server (~~express~~)
- Build in file-watching (~~nodemon~~)

## Caveats

- Bundles with esbuild are larger than with vite (rollup)
- no HMR, but HMR doesn't work well with React Router 6.4 anyway

## Todo

This is not done. How far can we get?

- Component testing?
- End-to-End testing?
- Reload the app when the server restarts

## License

MIT
