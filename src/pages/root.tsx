import { Outlet } from "react-router-dom";
import NavbarBS from "../components/NavbarBS";

function RootLayout() {
  return (
    <div>
      <NavbarBS />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default RootLayout;
