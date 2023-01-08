/**
 * This part of the code is based on the way `fresh` is bundling the code.
 * See https://github.com/denoland/fresh/blob/main/src/server/bundle.ts
 */

// -- esbuild --
// @deno-types="esbuild/mod.d.ts"
import * as esbuildNative from "esbuild/mod.js";
import * as esbuildWasm from "esbuild/wasm.js";
import { denoPlugin } from "esbuild_deno_loader/mod.ts";
const esbuild: typeof esbuildWasm = Deno.run === undefined
  ? esbuildWasm
  : esbuildNative;

let esbuildInitialized = false;
async function verifyEsbuildInitialized() {
  if (!esbuildInitialized) {
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
}

export async function bundle(entryPoint: string, importMapURL: URL) {
  await verifyEsbuildInitialized();
  console.log(new Date(), "Bundling", entryPoint);
  const res = await esbuild.build({
    entryPoints: [new URL(`../${entryPoint}`, import.meta.url).href],
    bundle: true,
    platform: "neutral",
    treeShaking: true,
    minify: true,
    outfile: "",
    outdir: ".",
    target: ["chrome99", "firefox99", "safari15"],
    write: false,
    jsx: "automatic",
    jsxImportSource: "react",
    format: "esm",
    plugins: [
      denoPlugin({
        importMapURL,
      }),
    ],
  });
  if (res.errors.length > 0) {
    throw res.errors[0];
  }
  console.log(new Date(), "Finished bundling", entryPoint);
  return res.outputFiles[0].text;
}
