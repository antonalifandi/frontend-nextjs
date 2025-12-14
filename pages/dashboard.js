import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../src/app/components/sidebar";


const Dashboard = () => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [loading, setLoading] = useState(false);
  const [visiMisi, setVisiMisi] = useState(null);

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

  useEffect(() => {
    const fetchVisiMisi = async () => {
      try {
        const response = await fetch("http://localhost:8080/visi-misi");
        const data = await response.json();
        setVisiMisi(data);
      } catch (error) {
        console.error("Error fetching Visi Misi:", error);
      }
    };

    fetchVisiMisi();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
          <div className="flex flex-col items-center">
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

        <main className="flex-1 overflow-auto flex flex-col bg-white p-8 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-8 bg-gray-100 p-6 rounded-2xl shadow-md text-gray-800">
            <h1 className="text-4xl font-semibold">Dashboard</h1>
          </div>

          {/* Visi Misi Section */}
          <div className="flex-1 mb-8 p-8 bg-white rounded-2xl shadow-xl mx-6 my-4 space-y-8">
            <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
              VISI & MISI
            </h2>
            <h3 className="text-xl font-medium text-gray-700 text-center mb-8">
              HIMAUNTIKA
            </h3>

            <div className="flex justify-center mb-8">
              <img
                src="/images/himauntika.png"
                alt="HIMAUNTIKA Logo"
                className="h-64 w-64 object-contain rounded-full shadow-md"
              />
            </div>

            {visiMisi ? (
              <div className="space-y-8">
                {/* Visi Section */}
                <div className="bg-gray-100 rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    Visi
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {visiMisi.visi}
                  </p>
                </div>

                {/* Misi Section */}
                <div className="bg-gray-100 rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    Misi
                  </h3>
                  <ol className="list-decimal pl-6 text-gray-600 space-y-2">
                    {Array.isArray(visiMisi.misi) ? (
                      visiMisi.misi.map((misi, index) => (
                        <li key={index} className="mb-2 text-lg">
                          {misi}
                        </li>
                      ))
                    ) : typeof visiMisi.misi === "string" ? (
                      visiMisi.misi.split("\n").map((misi, index) => (
                        <li key={index} className="mb-2 text-lg">
                          {misi}
                        </li>
                      ))
                    ) : (
                      <li>No Misi available</li>
                    )}
                  </ol>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-center">
                Loading Visi & Misi...
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
