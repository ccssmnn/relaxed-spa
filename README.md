# Relaxed SPA

Lets build a full stack SPA without the hassle.

## Tools

- Deno is the No-Build, No-Install, Fast and Secure Typescript and JSX
  experience
- React + React Router (>= 6.4) are a charm for client side data loading (Remix
  vibes in your SPA)
- twind enables TailwindCSS-style utility classes without a build step
- trpc + zod gets us the typesafe API

## Goals

- avoid a build step
- ready for Deno Deply
- keep full control over the server (as few abstractions as possible)
- keep dev-experience as close to production experience as possible

## Caveats

- Bundles with esbuild are larger than with vite (rollup)
- no HMR, but HMR doesn't work well with React Router 6.4 anyway

## License

MIT
