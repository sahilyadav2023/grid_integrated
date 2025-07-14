import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavLink {
  to: string;
  label: string;
}

const links: NavLink[] = [
  { to: "/live", label: "Live Session" },
  { to: "/courses", label: "Courses" },
  { to: "/rewards", label: "Rewards" },
  { to: "/profile", label: "Profile" },
];

export default function Topbar() {
  const { pathname } = useLocation();

  return (
    <header className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo section */}
      <div className="flex items-center gap-2">
        <img src="/assets/grid-logo.png" alt="GRiD Logo" className="w-8 h-8" />
        <span className="text-xl font-semibold text-blue-900">GRiD</span>
      </div>

      {/* Navigation links */}
      <nav className="flex gap-6">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`text-sm font-medium ${
              pathname === link.to
                ? "text-orange-600 border-b-2 border-orange-600 pb-1"
                : "text-gray-600 hover:text-orange-500"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
