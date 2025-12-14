'use client';

import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { useAuth } from "@/app/lib/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const { user } = useAuth();
  const router = useRouter();
  const auth = getAuth();

  const [registerError, setRegisterError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return null; // jeśli użytkownik jest zalogowany, nie pokazuj formularza
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setRegisterError("");

    const email = e.target["email"].value;
    const password = e.target["password"].value;
    const confirmPassword = e.target["confirmPassword"].value;

    // walidacja równości haseł
    if (password !== confirmPassword) {
      setRegisterError("Hasła nie są takie same!");
      return;
    }

   try {
  setLoading(true);
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  console.log("User registered!");

  // Wylogowanie po rejestracji (Firebase automatycznie loguje)
  await signOut(auth);

  // Przekierowanie do logowania
  router.push("/user/signin");

} catch (error) {
  if (error.code === "auth/email-already-in-use") {
    setRegisterError("Ten adres email jest już zarejestrowany!");
  } else {
    setRegisterError(error.message);
  }
  console.error(error);
} finally {
  setLoading(false);
}
  };


  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow text-black">
      <h2 className="text-2xl font-bold mb-4">Rejestracja</h2>

      {/* Alert DaisyUI dla błędu */}
      {registerError && (
        <div className="alert alert-error mb-4">
          <span>{registerError}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="input input-bordered w-full"
        />
        <input
          type="password"
          name="password"
          placeholder="Hasło"
          required
          className="input input-bordered w-full"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Powtórz hasło"
          required
          className="input input-bordered w-full"
        />
        <button
          type="submit"
          className={`btn btn-primary ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          Zarejestruj się
        </button>
      </form>
    </div>
  );
}
