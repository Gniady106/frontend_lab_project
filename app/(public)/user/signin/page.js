'use client';

import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence, signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [returnUrl, setReturnUrl] = useState("/user/profile");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const url = params.get("returnUrl");
    if (url) setReturnUrl(url);
  }, [params]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Sprawdzenie weryfikacji email
      if (!userCredential.user.emailVerified) {
        // Wyloguj użytkownika
        await signOut(auth);
        // Przekieruj na stronę weryfikacji
        router.push(`/user/verify?email=${encodeURIComponent(email)}`);
        return;
      }

      // Jeśli zweryfikowany, przekieruj do docelowego URL
      router.push(returnUrl);

    } catch (err) {
      console.error(err);
      setError("Niepoprawny email lub hasło");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-900 text-white p-8 rounded-2xl shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold">Zaloguj się</h2>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4" data-testid="login-form">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 border border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Hasło"
              required
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 border border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition
                       py-2 rounded font-semibold disabled:opacity-60"
          >
            {loading ? "Logowanie..." : "Zaloguj się"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center text-gray-500">
        Ładowanie...
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
