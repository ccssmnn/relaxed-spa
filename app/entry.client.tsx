import install from "@twind/with-react";
import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import twindConfig from "../twind.config.ts";
import { router } from "./main.tsx";

// initialize twind
install(twindConfig);

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
