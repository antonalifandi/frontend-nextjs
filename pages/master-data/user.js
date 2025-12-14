import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../src/app/components/sidebar/index";
import UserTable from "./components/UserTable";
import EditUserModal from "../master-data/components/EditUserModal";
import AddUserModal from "../master-data/components/AddUserModal";
import { useAuth } from "../../src/app/context/AuthContext";
import Layout from "../../src/app/components/layout/Layout";
import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Datausers = () => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("Datausers");
  const [users, setUsers] = useState([]);
  const { loading, setLoading, handleLogout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const getAccessToken = () => {
    if (typeof document !== "undefined") {
      const token = document.cookie.split("access_token=")[1];
      return token ? token.split(";")[0] : null;
    }
    return null;
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    if (menu === "Datausers") {
      fetchUsers();
    }
  };

  const fetchUsers = useCallback(async () => {
    const startTime = Date.now();
    const token = getAccessToken();
    if (!token) {
      alert("Token is missing. Please login again.");
      router.push("/auth/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/master-data`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      const elapsed = Date.now() - startTime;
      const minLoading = 400;
      const remaining = minLoading - elapsed;
      if (remaining > 0) setTimeout(() => {}, remaining);
    }
  }, [router]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    const token = getAccessToken();
    if (!token) {
      alert("Token is missing. Please login again.");
      router.push("/login");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          Swal.fire("Deleted!", "The user has been deleted.", "success");
          setLoading(true);

          setTimeout(() => {
            fetchUsers();
            setLoading(false);
          }, 1500);
        } else {
          throw new Error("Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire(
          "Error",
          "An error occurred while deleting the user.",
          "error"
        );
      }
    }
  };

  const handleAddUser = async (newUser) => {
    const token = getAccessToken();

    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to create user");
      }

      Swal.fire("Success", "User created successfully", "success");
      setIsAddModalOpen(false);
      fetchUsers();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleSave = async (updatedUser) => {
    const token = getAccessToken();

    if (!token) {
      Swal.fire("Error", "Token missing, please login again", "error");
      router.push("/login");
      return;
    }

    // HAPUS password jika kosong
    const payload = { ...updatedUser };
    if (!payload.password) {
      delete payload.password;
    }

    try {
      const response = await fetch(`${API_URL}/users/${updatedUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        console.error("Update error:", err);
        throw new Error(err.message || "Update failed");
      }

      Swal.fire("Success", "User updated successfully", "success");
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", error.message, "error");
    }
  };

  useEffect(() => {
    if (activeMenu === "Datausers") {
      fetchUsers();
    }
  }, [fetchUsers, activeMenu]);

  return (
    <Layout handleMenuClick={handleMenuClick} handleLogout={handleLogout}>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-70 z-50">
          <div className="w-16 h-16 border-4 border-t-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Konten utama */}
      <div className="flex-1 overflow-auto flex flex-col p-6">
        <div className="flex-1 mb-6">
          <UserTable
            users={users}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleAdd={() => setIsAddModalOpen(true)}
          />
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <EditUserModal
          isOpen={isModalOpen}
          user={selectedUser}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {isAddModalOpen && (
        <AddUserModal
          isOpen={isAddModalOpen}
          onSave={handleAddUser}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </Layout>
  );
};

export default Datausers;
