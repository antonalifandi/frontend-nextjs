import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Cookie from "js-cookie";
import MenuItem from "./MenuItem";

const Sidebar = ({ handleMenuClick, handleLogout, isOpen, setIsOpen }) => {
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userRole = Cookie.get("role");
    if (userRole) setRole(userRole);
  }, []);

  const menuItems = [
    {
      name: "Dashboard",
      icon: "FaHome",
      action: () => router.push("/dashboard"),
      path: "/dashboard",
    },
    {
      name: "Master Data",
      icon: "FaCog",
      role: ["ADMIN"],
      submenu: [
        {
          name: "Users",
          icon: "FaUsers",
          action: () => router.push("/master-data/user"),
          path: "/master-data/user",
        },
        {
          name: "Visi Misi",
          icon: "FaPencilAlt",
          action: () => router.push("/master-data/visi-misi"),
          path: "/master-data/visi-misi",
        },
      ],
    },
    {
      name: "Logout",
      icon: "FaSignOutAlt",
      action: handleLogout,
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.role || (role && item.role.includes(role))
  );

  return (
    <aside
      className={`
    fixed top-0 left-0 h-screen
    bg-white text-gray-800 shadow-lg z-50
    transition-all duration-300
    ${isOpen ? "w-72" : "w-20"}
  `}
    >
      <div className="h-16 mt-4 flex items-center font-bold text-2xl text-gray-600 px-4 overflow-hidden">
        <Image src="/images/himauntika.png" alt="Logo" width={40} height={40} />

        <span
          className={`
      ml-4 whitespace-nowrap
      transition-all duration-300 ease-in-out
      ${isOpen ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"}
    `}
        >
          HIMAUNTIKA
        </span>
      </div>
      <nav className="mt-4">
        {filteredMenuItems.map((item) => (
          <MenuItem
            key={item.name}
            item={item}
            handleMenuClick={handleMenuClick}
            router={router}
            isSidebarOpen={isOpen}
            setSidebarOpen={setIsOpen}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
