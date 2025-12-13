import Link from "next/link";
import { FaHome, FaUser, FaSignInAlt } from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col p-4">
      <h2 className="mb-6 text-xl font-bold">Frontend Lab</h2>

      <nav className="flex flex-col gap-4">
        <Link href="/" className="flex items-center gap-2 hover:text-blue-400">
          <FaHome /> Home
        </Link>

        <Link
          href="/user/profile"
          className="flex items-center gap-2 hover:text-blue-400"
        >
          <FaUser /> Profil
        </Link>

        <Link
          href="/user/signin"
          className="flex items-center gap-2 hover:text-blue-400"
        >
          <FaSignInAlt /> Logowanie
        </Link>
      </nav>
    </aside>
  );
}
