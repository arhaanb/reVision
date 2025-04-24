import { Link, useLocation } from "react-router-dom";

import logoVision from "../assets/logo-vision.svg";

export default function Navbar() {
  const location = useLocation();
  return (
    <nav
      className="flex justify-between items-center px-6 py-3 bg-transparent shadow-sm border-b border-orange-200 z-20"
      style={{ overflow: "visible" }}
    >
      <div className="flex items-center gap-2 select-none">
        <img
          src={logoVision}
          alt="Vision Logo"
          className="h-9 mr-2"
          style={{ width: 150 }}
        />
      </div>
      <div className="flex space-x-6">
        <Link
          to="/"
          className={`text-base font-medium px-3 py-1 transition-all duration-200 rounded-md hover:bg-orange-100 hover:text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
            location.pathname === "/"
              ? "bg-orange-100 text-orange-700"
              : "text-orange-600"
          }`}
        >
          Home
        </Link>
        <Link
          to="/about"
          className={`text-base font-medium px-3 py-1 transition-all duration-200 rounded-md hover:bg-orange-100 hover:text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
            location.pathname === "/about"
              ? "bg-orange-100 text-orange-700"
              : "text-orange-600"
          }`}
        >
          About
        </Link>
      </div>
    </nav>
  );
}
