"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/lib/AuthContext";
import { db } from "@/app/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";


export default function ProfileForm() {
  const { user } = useAuth();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");

    useEffect(() => {
    if (!user) return;

    const loadAddress = async () => {
      try {
        const snapshot = await getDoc(doc(db, "users", user.uid));
        if (snapshot.exists()) {
          const address = snapshot.data().address;
          setStreet(address?.street || "");
          setCity(address?.city || "");
          setZipCode(address?.zipCode || "");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadAddress();
  }, [user]);

  // 🧱 DOPIERO TERAZ WARUNEK
  if (!user) {
    return <p>Nie jesteś zalogowany</p>;
  }

  if (loading) {
    return <p>Ładowanie danych...</p>;
  }


  // 🔹 SUBMIT
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const displayName = e.target["displayName"].value;
    const photoURL = e.target["photoURL"].value;

    try {
      await updateProfile(user, {
        displayName,
        photoURL,
      });

      await setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email,
          displayName,
          photoURL,
          address: {
            street,
            city,
            zipCode,
          },
        },
        { merge: true }
      );

      setSuccess("Profil został zapisany");
    } catch (e) {
      console.error(e);
      if (e.code === "permission-denied") {
        setError("Brak uprawnień do zapisu danych");
      } else {
        setError(e.message);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow text-black">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Profil użytkownika</h2>

        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt="Zdjęcie profilowe"
            className="w-24 h-24 rounded-full"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
            Brak zdjęcia
          </div>
        )}
      </div>

      {error && <div className="alert alert-error mb-4">{error}</div>}
      {success && <div className="alert alert-success mb-4">{success}</div>}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label>
          Nazwa wyświetlana
          <input
            name="displayName"
            defaultValue={user.displayName || ""}
            className="input input-bordered w-full"
          />
        </label>

        <label>
          Email
          <input
            value={user.email}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </label>

        <label>
          URL zdjęcia
          <input
            name="photoURL"
            defaultValue={user.photoURL || ""}
            className="input input-bordered w-full"
          />
        </label>

        <label>
          Ulica
          <input
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            disabled={loading}
            className="input input-bordered w-full"
          />
        </label>

        <label>
          Miasto
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={loading}
            className="input input-bordered w-full"
          />
        </label>

        <label>
          Kod pocztowy
          <input
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            disabled={loading}
            className="input input-bordered w-full"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          Zaktualizuj profil
        </button>
      </form>
    </div>
  );
}
