import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <>
      <Header />
      <Outlet />
      <Toaster />
      <Footer />
    </>
  );
}
