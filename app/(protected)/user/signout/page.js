'use client';

import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

export default function LogoutForm() {
  const router = useRouter();

  const onSubmit = (e) => {
    e.preventDefault();
    signOut(auth)
      .then(() => {
        router.push("/"); // po wylogowaniu przekierowanie na stronę główną
      })
      .catch((error) => {
        console.error("Błąd przy wylogowaniu:", error);
      });
  };

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto mt-10 p-4 border rounded shadow flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold">Wyloguj się</h2>
      <button type="submit" className="btn btn-error">
        Wyloguj
      </button>
    </form>
  );
}
