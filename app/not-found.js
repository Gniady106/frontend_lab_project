import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-4xl font-bold">
        404
      </h1>

      <p className="mb-6 text-gray-600">
        Podana strona nie istnieje.
      </p>

      <Link
        href="/"
        className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        Wróć do strony głównej
      </Link>
    </div>
  );
}
