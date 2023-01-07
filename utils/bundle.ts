/**
 * This part of the code is based on the way `fresh` is bundling the code.
 * See https://github.com/denoland/fresh/blob/main/src/server/bundle.ts
 */

// @deno-types="esbuild/mod.d.ts"
import * as esbuildWasm from "esbuild/wasm.js";
import { denoPlugin } from "esbuild_deno_loader/mod.ts";

export const esbuild: typeof esbuildWasm = esbuildWasm;

let esbuildInitialized = false;
async function initEsbuild() {
  if (!esbuildInitialized) {
    console.log("Initializing esbuild...");
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
    esbuildInitialized = true;
    console.log("esbuild initialized.");
  }
}

export async function bundle(entryPoint: string, importMapURL: URL) {
  await initEsbuild();
  console.log("Bundling", entryPoint);
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
    plugins: [
      denoPlugin({
        importMapURL,
      }),
    ],
  });
  if (res.errors.length > 0) {
    throw res.errors[0];
  }
  console.log("Finished bundling", entryPoint);
  return res.outputFiles[0].text;
}
