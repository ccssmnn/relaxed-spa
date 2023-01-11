/**
 * This part of the code is based on the way `fresh` is bundling the code.
 * See https://github.com/denoland/fresh/blob/main/src/server/bundle.ts
 */

// @deno-types="https://deno.land/x/esbuild@v0.14.51/mod.d.ts"
import * as esbuildNative from "https://deno.land/x/esbuild@v0.14.51/mod.js";
import * as esbuildWasm from "https://deno.land/x/esbuild@v0.14.51/wasm.js";
import { denoPlugin } from "https://deno.land/x/esbuild_deno_loader@0.5.2/mod.ts";

const esbuild: typeof esbuildWasm = Deno.run === undefined
  ? esbuildWasm
  : esbuildNative;

let esbuildInitialized = false;
async function verifyEsbuildInitialized() {
  if (esbuildInitialized) {
    return;
  }
  console.log(new Date(), "start initializing esbuild");
  if (Deno.run === undefined) {
    const wasmURL = new URL("./esbuild@v0.14.51.wasm", import.meta.url).href;
    const resp = await fetch(wasmURL);
    const wasm = new Response(resp.body, {
      headers: { "Content-Type": "application/wasm" },
    });
    const wasmModule = await WebAssembly.compileStreaming(wasm);
    await esbuild.initialize({
      wasmModule,
      worker: false,
    });
  } else {
    await esbuild.initialize({});
  }
  esbuildInitialized = true;
  console.log(new Date(), "esbuild initialized");
}

export async function createBundle(
  entryPoint: URL,
  importMapURL: URL,
  isDev?: boolean,
) {
  await verifyEsbuildInitialized();
  console.log(new Date(), "Bundling", entryPoint.href);
  const absWorkingDir = Deno.cwd();
  const res = await esbuild.build({
    bundle: true,
    entryPoints: [entryPoint.href],
    platform: "neutral",
    treeShaking: true,
    minify: !isDev,
    sourcemap: isDev ? "inline" : false,
    outfile: "",
    absWorkingDir,
    outdir: ".",
    target: ["chrome99", "firefox99", "safari15"],
    write: false,
    format: "esm",
    plugins: [denoPlugin({ importMapURL })],
    splitting: false,
    jsx: "automatic",
    jsxImportSource: "react",
  });
  if (res.errors.length > 0) {
    throw res.errors;
  }
  console.log(new Date(), "Finished bundling", entryPoint.href);
  return res.outputFiles[0].text;
}
