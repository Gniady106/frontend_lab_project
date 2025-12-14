'use client';

import Link from "next/link";
import { useAuth } from "@/app/lib/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/"); // po wylogowaniu redirect na stronę główną
  };

  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10 text-white p-2 bg-green-500 rounded-full"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl">Tailblocks</span>
        </a>

        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          <a href="/articles" className="mr-5 hover:text-gray-900">Artykuły</a>
          <a href="/user/profile"className="mr-5 hover:text-gray-900">Profil</a>
          
        </nav>

        {/* Jeśli użytkownik zalogowany */}
        {user ? (
          <div className="flex items-center gap-4">
            <Link
              href="/user/profile"
              className="rounded bg-gray-200 px-4 py-2 hover:bg-green-300"
            >
            <span className="text-gray-700 font-medium">Witaj, {user.email}</span>
            </Link>
          
            <button
              onClick={handleLogout}
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Wyloguj
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <>
              <Link
                href="/user/signin"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Logowanie
              </Link>
            
              <Link
                href="/user/register"
                className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
              >
                Rejestracja
              </Link>
            </>
          </div>
        )}
      </div>
    </header>
  );
}
