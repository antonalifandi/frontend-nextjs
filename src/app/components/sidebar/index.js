import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Cookie from "js-cookie";
import MenuItem from "./MenuItem";

const Sidebar = ({ handleMenuClick, handleLogout }) => {
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
    <aside className="w-72 bg-white text-gray-800 flex flex-col shadow-lg rounded-lg transform transition-all duration-300 ease-in-out hover:shadow-3xl">
      <div className="h-16 mt-4 flex items-center justify-start font-bold text-2xl text-gray-600 px-6 py-4">
        <Image src="/images/himauntika.png" alt="Logo" width={60} height={60} />
        <span className="ml-4">HIMAUNTIKA</span>
      </div>
      <nav className="mt-4">
        {filteredMenuItems.map((item) => (
          <MenuItem
            key={item.name}
            item={item}
            handleMenuClick={handleMenuClick}
            router={router}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
