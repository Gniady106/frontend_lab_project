'use client';

import Link from "next/link";
import {
  FaHome,
  FaUser,
  FaSignInAlt,
  FaNewspaper,
  FaPuzzlePiece
} from "react-icons/fa";
import { useAuth } from "@/app/lib/AuthContext";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const navItem = (href, icon, label) => {
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        className={`
          flex items-center gap-3 px-4 py-2 rounded-lg transition
          ${isActive
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"}
        `}
      >
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col p-4 border-r border-gray-800">
     
      <h1 className="mb-8 text-xl font-bold tracking-wide">
        Crossword
      </h1>

  
      <nav className="flex flex-col gap-1">
        {navItem("/", <FaHome />, "Home")}
        {navItem("/user/profile", <FaUser />, "Profil")}
        {navItem("/articles", <FaNewspaper />, "Artykuły")}
        {navItem("/crossword", <FaPuzzlePiece />, "Wykreślanka")}

        {!user && !loading && navItem("/user/signin", <FaSignInAlt />, "Logowanie")}
      </nav>
    </aside>
  );
}
