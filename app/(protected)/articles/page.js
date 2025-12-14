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

  if (!user) return <p>Nie jesteś zalogowany</p>;
  if (loading) return <p>Ładowanie artykułów...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 text-black">
      <h2 className="text-2xl font-bold mb-6">Twoje artykuły</h2>
      {articles.length === 0 ? (
        <p>Brak artykułów</p>
      ) : (
        <ul className="space-y-4">
          {articles.map(article => (
            <li key={article.id} className="border p-4 rounded shadow">
              <h3 className="font-bold text-lg">{article.title}</h3>
              <p>{article.content}</p>
              {article.date?.toDate ? (
                <small>{article.date.toDate().toLocaleString()}</small>
              ) : (
                <small>{article.date || "Brak daty"}</small>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}