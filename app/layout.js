import "./globals.css";
import Sidebar from "./components/sidebar";
import Topbar from "./components/topbar";
import Footer from "./components/footer";
import { AuthProvider } from "@/app/lib/AuthContext";

export const metadata = {
  title: "Frontend Laboratory App",
  description: "Projekt Next.js + Firebase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      
        <body className="flex min-h-screen">
          <AuthProvider>

          {/* Sidebar */}
          <Sidebar />
        
          {/* Main content */}
          <div className="flex flex-1 flex-col">
            <Topbar />
        
            <main className="flex-1 p-6 bg-gray-50">
              {children}
            </main>
        
            <Footer />
          </div>
          </AuthProvider>
        </body>
    </html>
  );
}
