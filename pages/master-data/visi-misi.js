import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../src/app/components/sidebar/index";
import VisiMisiTable from "./components/VisiMisiTable";
import EditVisiMisiModal from "./components/EditVisiMisiModal";
import { useAuth } from "../../src/app/context/AuthContext";
import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const VisiMisi = () => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("VisiMisi");
  const [items, setItems] = useState([]);
  const { loading, setLoading, handleLogout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const getAccessToken = () => {
    if (typeof document !== "undefined") {
      const token = document.cookie.split("access_token=")[1];
      return token ? token.split(";")[0] : null;
    }
    return null;
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    if (menu === "VisiMisi") {
      fetchItems();
    }
  };

const fetchItems = useCallback(async () => {
  const token = getAccessToken();
  if (!token) {
    alert("Token is missing. Please login again.");
    router.push("/auth/login");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/visi-misi`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();
    setItems([data]);
  } catch (error) {
    console.error(error);
  }
}, [router]);


  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };


  const handleSave = async (updatedItem) => {
    const token = getAccessToken();
    if (!token) {
      Swal.fire("Error", "Token missing, please login again", "error");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/visi-misi/${updatedItem.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Update failed");
      }

      Swal.fire("Success", "Item updated successfully", "success");
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  useEffect(() => {
    if (activeMenu === "VisiMisi") fetchItems();
  }, [fetchItems, activeMenu]);

  return (
    <div className="flex flex-col h-screen">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-70 z-50">
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
        <main className="flex-1 overflow-auto flex flex-col bg-gray-50">
          <div className="flex justify-between mb-6 bg-white p-6 rounded-md shadow-sm">
            <h1 className="text-3xl font-bold text-gray-800">
              Master Data Visi Misi
            </h1>
          </div>
          <div className="flex-1 mb-6 p-6">
            <VisiMisiTable
              items={items || []}
              handleEdit={handleEdit}
              handleAdd={() => setIsAddModalOpen(true)}
            />
          </div>
        </main>
      </div>

      {isModalOpen && (
        <EditVisiMisiModal
          isOpen={isModalOpen}
          item={selectedItem}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default VisiMisi;
