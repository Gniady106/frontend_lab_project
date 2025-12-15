"use client";

import Link from "next/link";
import { useAuth } from "@/app/lib/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import { FaPuzzlePiece } from "react-icons/fa";

export default function Topbar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 text-white flex items-center px-6">
      <div className="flex w-full items-center justify-between">
        {/* LEFT – logo / tytuł */}
        <div className="text-lg font-semibold tracking-wide">
          <FaPuzzlePiece className="text-blue-400 text-xl" />
        </div>

        {/* RIGHT – auth section */}
        {user ? (
          <div className="flex items-center gap-4">
            {/* Avatar + greeting */}
            <div className="flex items-center gap-3 bg-gray-800 px-3 py-1.5 rounded-full">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm">
                  ?
                </div>
              )}

              <span className="text-sm font-medium">
                Witaj, {user.email.split("@")[0]}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-red-600 text-sm font-medium hover:bg-red-700 transition"
            >
              Wyloguj
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/user/signin"
              className="px-4 py-2 rounded-md bg-blue-600 text-sm font-medium hover:bg-blue-700 transition"
            >
              Logowanie
            </Link>

            <Link
              href="/user/register"
              className="px-4 py-2 rounded-md bg-green-600 text-sm font-medium hover:bg-green-700 transition"
            >
              Rejestracja
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
