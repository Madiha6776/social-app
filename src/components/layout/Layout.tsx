import { Outlet } from "react-router-dom";
import { NavbarCom } from "./Navbar";
import { Footer } from "flowbite-react";

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <NavbarCom></NavbarCom>
      <Outlet />
      <Footer></Footer>
    </div>
  );
}
