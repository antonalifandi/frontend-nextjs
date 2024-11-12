import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Sidebar from "../src/app/components/sidebar";
import Footer from "../src/app/components/footer";

const Dashboard = () => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [loading, setLoading] = useState(false);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      document.cookie = "access_token=; Max-Age=0; path=/";
      setLoading(false);
      router.push("/login");
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-70 z-50">
          <div className="flex flex-col items-center">
            {/* Logo di tengah */}
            {/* <Image
              src="/images/logo-bening-guru-semesta.png"
              alt="Loading Logo"
              width={100}
              height={100}
            /> */}
            {/* Spinner */}
            <div className="mt-4 w-16 h-16 border-4 border-t-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      <div
        className={`flex flex-1 overflow-hidden ${
          loading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <Sidebar
          activeMenu={activeMenu}
          handleMenuClick={handleMenuClick}
          handleLogout={handleLogout}
        />
        <main className="flex-1 overflow-auto flex flex-col bg-gray-50">
          <div className="flex justify-between mb-6 bg-white p-6 rounded-md shadow-sm">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          </div>
          <div className="flex-1 mb-6 p-6"></div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
