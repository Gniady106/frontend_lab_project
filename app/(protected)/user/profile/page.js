'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/app/lib/AuthContext";
import { db } from "@/app/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { FaUser, FaEnvelope, FaImage, FaMapMarkerAlt } from "react-icons/fa";

export default function ProfileForm() {
  const { user } = useAuth();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const snapshot = await getDoc(doc(db, "users", user.uid));
        if (snapshot.exists()) {
          const data = snapshot.data();
          setDisplayName(data.displayName || "");
          setPhotoURL(data.photoURL || "");
          setStreet(data.address?.street || "");
          setCity(data.address?.city || "");
          setZipCode(data.address?.zipCode || "");
        } else {
          setDisplayName(user.displayName || "");
          setPhotoURL(user.photoURL || "");
        }
      } catch (e) {
        console.error(e);
        setError("Błąd podczas ładowania danych");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (!user) return <p>Nie jesteś zalogowany</p>;
  if (loading) return <p>Ładowanie danych...</p>;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await updateProfile(user, { displayName, photoURL });

      await setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email,
          displayName,
          photoURL,
          address: { street, city, zipCode }
        },
        { merge: true }
      );

      setSuccess("Profil został zapisany");
    } catch (e) {
      console.error(e);
      setError(e.code === "permission-denied" ? "Brak uprawnień do zapisu" : e.message);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-900 text-white p-8 rounded-2xl shadow-xl">

        
        <div className="flex flex-col items-center mb-6">
          {photoURL ? (
            <img
              src={photoURL}
              alt="Avatar"
              className="w-20 h-20 rounded-full mb-3 object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-3 text-xl">
              <FaUser />
            </div>
          )}
          <h2 className="text-2xl font-bold">Profil użytkownika</h2>
        </div>

        
        {error && (
          <div className="mb-4 px-4 py-2 text-red-400 bg-red-500/10 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 px-4 py-2 text-green-400 bg-green-500/10 rounded">
            {success}
          </div>
        )}

        
        <form onSubmit={onSubmit} className="space-y-4">

          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Nazwa wyświetlana"
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 border border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-700 border border-gray-600 text-gray-300"
            />
          </div>

          <div className="relative">
            <FaImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="photoURL"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="URL zdjęcia"
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 border border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            />
          </div>

          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Ulica"
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 border border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            />
          </div>

          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Miasto"
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 border border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            />
          </div>

          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Kod pocztowy"
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 border border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-semibold"
          >
            Zaktualizuj profil
          </button>

        </form>
      </div>
    </div>
  );
}
