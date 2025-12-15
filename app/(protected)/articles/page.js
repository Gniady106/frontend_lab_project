'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/app/lib/AuthContext";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs, doc } from "firebase/firestore";

export default function ArticlesPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchArticles = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const q = query(collection(db, "articles"), where("user", "==", userRef));

        const querySnapshot = await getDocs(q);
        const articlesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setArticles(articlesData);
      } catch (err) {
        console.error("Błąd pobierania artykułów:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [user]);

  if (!user) return <p className="text-center mt-10 text-red-600">Nie jesteś zalogowany</p>;
  if (loading) return <p className="text-center mt-10">Ładowanie artykułów...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 text-black">
      <h2 className="text-3xl font-bold mb-6 text-center">Twoje artykuły</h2>
      {articles.length === 0 ? (
        <p className="text-center text-gray-600">Brak artykułów</p>
      ) : (
        <ul className="space-y-6">
          {articles.map(article => (
            <li
              key={article.id}
              className="border border-gray-200 p-6 rounded-xl shadow hover:shadow-lg shadow-blue-300 shadow transition-shadow duration-300"
            >
              <h3 className="font-bold text-xl mb-2">{article.title}</h3>
              <p className="text-gray-800 mb-4">{article.content}</p>
              <div className="text-sm text-gray-500 flex justify-between">
                <span>{article.date?.toDate ? article.date.toDate().toLocaleString() : article.date || "Brak daty"}</span>
                <span>{user.email.split("@")[0]}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
