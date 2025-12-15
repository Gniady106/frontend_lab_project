'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/app/lib/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs, doc } from "firebase/firestore";

export default function ArticlesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      // przekierowanie niezalogowanego
      router.push("/user/signin?returnUrl=/articles");
      return;
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchArticles = async () => {
      try {
        setFetching(true);
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
        setFetching(false);
      }
    };

    fetchArticles();
  }, [user]);

  if (loading || !user || fetching) {
    return <p className="text-center mt-20 text-gray-600">Ładowanie artykułów...</p>;
  }

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
              className="border border-gray-200 p-6 rounded-xl shadow hover:shadow-lg transition-shadow duration-300"
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
