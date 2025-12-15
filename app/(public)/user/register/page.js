'use client';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { useAuth } from "@/app/lib/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPuzzlePiece, FaEnvelope, FaLock } from "react-icons/fa";

export default function RegisterForm() {
  const { user } = useAuth();
  const router = useRouter();
  const auth = getAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setError("Hasła nie są takie same");
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);

      // Firebase automatycznie loguje → wyloguj
      await signOut(auth);

      router.push("/user/signin");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("Ten adres email jest już zarejestrowany");
      } else {
        setError("Błąd rejestracji. Spróbuj ponownie");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-900 text-white p-8 rounded-2xl shadow-xl">

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          
          <h2 className="text-2xl font-bold">Rejestracja</h2>
          
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="space-y-4"
          data-testid="register-form"
        >

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 border border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Hasło"
              required
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 border border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Confirm password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Powtórz hasło"
              required
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 border border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 transition
                       py-2 rounded font-semibold disabled:opacity-60"
          >
            {loading ? "Rejestrowanie..." : "Zarejestruj się"}
          </button>
        </form>
      </div>
    </div>
  );
}
