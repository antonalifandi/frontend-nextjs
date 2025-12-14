import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/router";
import VisiMisiTable from "./components/VisiMisiTable";
import EditVisiMisiModal from "./components/EditVisiMisiModal";
import { useAuth } from "../../src/app/context/AuthContext";
import Layout from "../../src/app/components/layout/Layout";
import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const VisiMisi = () => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("VisiMisi");
  const [items, setItems] = useState([]);
  const { loading, setLoading, handleLogout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    <Layout handleMenuClick={handleMenuClick} handleLogout={handleLogout}>
      <div className="flex-1 p-6">
        <VisiMisiTable items={items || []} handleEdit={handleEdit} />
      </div>

      {isModalOpen && (
        <EditVisiMisiModal
          isOpen={isModalOpen}
          item={selectedItem}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Layout>
  );
};

export default VisiMisi;
