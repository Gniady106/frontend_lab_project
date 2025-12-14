'use client';
import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useSearchParams } from "next/navigation";

export default function VerifyEmail() {
  const params = useSearchParams();
  const email = params.get("email") || "Twój adres email";
useEffect(() => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  if (currentUser && !currentUser.emailVerified) {
    signOut(auth);
  }
}, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow text-black">
      <h2 className="text-2xl font-bold mb-4">Weryfikacja email</h2>
      <p>
        Email <strong>{email}</strong> nie został zweryfikowany. 
        Proszę kliknij link w emailu, który został wysłany podczas rejestracji.
      </p>
    </div>
  );
}
