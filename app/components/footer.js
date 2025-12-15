export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
      <div className="container mx-auto px-5 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Lewa strona */}
        <div className="flex flex-col items-center md:items-start">
          <span className="text-sm">
            © {new Date().getFullYear()} Michał Gniadek
          </span>
          <span className="text-xs text-gray-500">
            Projekt Frontend Crossword
          </span>
        </div>

    

        {/* Prawa strona – social */}
        <div className="flex gap-4 text-sm">
          <a
            href="https://github.com/"
            target="_blank"
            className="hover:text-white transition"
          >
            GitHub
          </a>
        
        </div>

      </div>
    </footer>
  );
}
