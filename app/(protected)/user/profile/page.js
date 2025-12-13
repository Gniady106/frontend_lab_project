"use client";

import { useState } from "react";
import { useAuth } from "@/app/lib/AuthContext";
import { updateProfile } from "firebase/auth";

export default function ProfileForm() {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!user) {
    return <p>Ładowanie użytkownika...</p>; // lub redirect, jeśli chcesz
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const displayName = e.target["displayName"].value;
    const photoURL = e.target["photoURL"].value;

    try {
      await updateProfile(user, { displayName, photoURL });
      setSuccess("Profil zaktualizowany pomyślnie!");
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow text-black">
    
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold mb-4">Profil użytkownika</h2>
        
            {/* Podgląd zdjęcia profilowego */}
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Zdjęcie profilowe"
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mt-2">
              Brak zdjęcia
            </div>
          )}
      </ div>

      {/* Alert dla błędów */}
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Alert dla sukcesu */}
      {success && (
        <div className="alert alert-success mb-4">
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          Nazwa wyświetlana
          <input
            type="text"
            name="displayName"
            defaultValue={user.displayName || ""}
            className="input input-bordered w-full"
          />
        </label>

        <label className="flex flex-col">
          Email
          <input
            type="email"
            name="email"
            value={user.email}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </label>

        <label className="flex flex-col">
          URL zdjęcia
          <input
            type="text"
            name="photoURL"
            defaultValue={user.photoURL || "https://via.placeholder.com/150"}
            className="input input-bordered w-full"
          />
        </label>

      
        <button type="submit" className="btn btn-primary">
          Zaktualizuj profil
        </button>
      </form>
    </div>
  );
}
