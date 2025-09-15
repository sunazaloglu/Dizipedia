import { createBrowserRouter, type RouteObject } from "react-router-dom";
import RootLayout from "./pages/root";
import Home from "./pages/Home/Home";
import ShowDetail from "./pages/Show/ShowDetail";
import Search from "./pages/Search/Search";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "shows/:id",
        element: <ShowDetail />,
      },
      {
        path: "search",
        element: <Search />,
      },
    ],
  },
];

//uygulamamizi beslicek burdaki olusturdugumuz rotalari uygulamamiza gondericek
export const router = createBrowserRouter(routes);
