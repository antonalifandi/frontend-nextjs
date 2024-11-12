import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../src/app/components/sidebar";
import UserTable from "../src/app/components/UserTable";
import Footer from "../src/app/components/footer";
import EditUserModal from "../src/app/components/EditUserModal";
import Swal from "sweetalert2";

const Datausers = () => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("Datausers");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const getAccessToken = () => {
    const token = document.cookie.split("access_token=")[1];
    return token ? token.split(";")[0] : null;
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    if (menu === "Datausers") {
      fetchUsers();
    }
  };

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      document.cookie = "access_token=; Max-Age=0; path=/";
      setLoading(false);
      router.push("/login");
    }, 1500);
  };

  const fetchUsers = async () => {
    setLoading(true);
    const token = getAccessToken();
    if (!token) {
      alert("Token is missing. Please login again.");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/users/master-data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

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
        const response = await fetch(`http://localhost:8080/users/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        Swal.fire("Error!", "There was an issue deleting the user.", "error");
      }
    }
  };

  const handleSave = async (user) => {
    const token = getAccessToken();
    if (!token) {
      alert("Token is missing. Please login again.");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        fetchUsers();
        setIsModalOpen(false);
      } else {
        throw new Error("Failed to save user");
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  useEffect(() => {
    if (activeMenu === "Datausers") {
      fetchUsers();
    }
  }, [activeMenu]);

  return (
    <div className="flex flex-col h-screen">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-70 z-50">
          <div className="flex flex-col items-center">
            {/* Spinner */}
            <div className="mt-4 w-16 h-16 border-4 border-t-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      <div
        className={`flex flex-1 overflow-hidden ${loading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <Sidebar
          activeMenu={activeMenu}
          handleMenuClick={handleMenuClick}
          handleLogout={handleLogout}
        />
        <main className="flex-1 overflow-auto flex flex-col bg-gray-50">
          <div className="flex justify-between mb-6 bg-white p-6 rounded-md shadow-sm">
            <h1 className="text-3xl font-bold text-gray-800">Master Data Users</h1>
          </div>
          <div className="flex-1 mb-6 p-6">
            <UserTable
              users={users}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </div>
          <Footer />
        </main>
      </div>

      {isModalOpen && (
        <EditUserModal
          user={selectedUser}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Datausers;
