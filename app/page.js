'use client';

import Link from "next/link";
import { FaNewspaper, FaPuzzlePiece } from "react-icons/fa";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 text-black">
      {/* Hero section */}
      <div className="bg-blue-600 text-white rounded-lg p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-4">Frontend Crossword Project</h1>
          
          <div className="flex gap-4 flex-wrap">
            
            <Link href="/crossword" className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-100">
              <FaPuzzlePiece /> Wykreślanka
            </Link>
          </div>
        </div>
       
      

      
      </div>
    </div>
  );
}
