'use client';

import { useEffect, useState, Suspense } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useSearchParams } from "next/navigation";

function VerifyEmailContent() {
  const params = useSearchParams();
  const [email, setEmail] = useState("Twój adres email");

  useEffect(() => {
    const e = params.get("email");
    if (e) setEmail(e);

    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.emailVerified) {
      signOut(auth);
    }
  }, [params]);

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

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow text-black">
        <h2 className="text-2xl font-bold mb-4">Weryfikacja email</h2>
        <p>Ładowanie...</p>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}