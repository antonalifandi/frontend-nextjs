import { useState } from "react";
import Sidebar from "../sidebar";

export default function Layout({ children, handleLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Sidebar (floating) */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "ml-72" : "ml-20"
        }`}
      >
        {/* Header */}
        <header className="h-20 bg-white shadow-md flex items-center px-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-md border hover:bg-gray-100"
          >
            ☰
          </button>

          <span className="ml-4 font-semibold text-gray-700">
          </span>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
