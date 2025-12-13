'use client';

import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useSearchParams } from "next/navigation";

export default function VerifyEmail() {
  const params = useSearchParams();
  const email = params.get("email"); // email z query string

  useEffect(() => {
    // wylogowanie
    signOut(getAuth());
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow text-center">
      <h1 className="text-2xl font-bold mb-4">Weryfikacja email</h1>
      <p>
        Email nie został zweryfikowany. Sprawdź swoją skrzynkę i kliknij link w wiadomości wysłanej na adres:{" "}
        <strong>{email}</strong>
      </p>
      <p className="mt-4 text-gray-500">
        Po kliknięciu w link będziesz mógł się zalogować.
      </p>
    </div>
  );
}
