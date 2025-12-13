'use client';

import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const params = useSearchParams();
  const returnUrl = params.get("returnUrl") || "/user/profile";

  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const email = e.target["email"].value;
    const password = e.target["password"].value;

    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      if (returnUrl) {
        router.push(returnUrl);
      } else {
        router.push("/"); // domyślnie strona główna
      }
    } catch (err) {
      console.error(err.code, err.message);
      setError("Niepoprawny email lub hasło");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow text-black">
      <h2 className="text-2xl font-bold mb-4">Logowanie</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Hasło"
          required
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Zaloguj się
        </button>
      </form>
    </div>
  );
}
