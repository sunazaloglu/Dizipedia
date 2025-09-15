import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { router } from "./Route";


createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
