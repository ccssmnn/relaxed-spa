# Relaxed SPA

Modern tooling and web standards are so good. You might not need a framework to
build a great SPA. Bring your own everything. Go anywhere.

This should demonstrate how drastically tools like Deno & esbuild can simplify
web development. Checkout the app at
[relaxed-spa.deno.dev](https://relaxed-spa.deno.dev)

The main utilities are the bundling setup and the live reloading.

To get started, clone the repo and run `deno task start`.

## Goals

- avoid a build step
- ready for Deno Deploy
- keep full control about request handling (as few abstractions as possible)
- gradual disclosure of complexity

## Advantages

Fully utilizing Deno, We can skip lots of tooling & vscode-extensions

- no install step (well deno does download the dependencies behind the scenes)
- no build step (ultra fast deployments)
- write the scripts you may need in typescript & execute in deno (think database
  seeding)
- just-in-time client bundle generation (esbuild)
- Tailwind-in-JS (no postcss / autoprefixer)
- easily proxy or cache requests in deno and avoid cross origin requests (e.g.
  Supabase API requests)
- Built in testing
- Built in TypeScript support (no extra tsc dependency)
- Built in linting (no eslint + config + vscode extension)
- Built in formatter (no prettier + vscode extension)
- Built in server (no express, but you can always opt-in if you like)
- Built in file-watching (no nodemon)
- Built in compression (no compression middleware)

## Used Libraries

- React Router (>= 6.4) has wonderful data loading APIs based on web
  fundamentals
- twind enables TailwindCSS-style utility classes without a build step

## Caveats

- no HMR, but HMR doesn't work well with React Router 6.4 anyway

## Todo

How far can we get?

- code splitting
- example testing setup
  - Component testing
  - End-to-End testing
- Add Supabase

## License

MIT
