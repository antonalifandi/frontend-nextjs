import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Cookie from "js-cookie";
import {
  FaHome,
  FaUsers,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaCog,
} from "react-icons/fa";

const Sidebar = ({ handleMenuClick, handleLogout }) => {
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [openMenus, setOpenMenus] = useState({}); 

  useEffect(() => {
    const userRole = Cookie.get("role");
    if (userRole) setRole(userRole);
  }, []);

  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      action: () => router.push("/dashboard"),
      path: "/dashboard",
    },
    {
      name: "Master Data",
      icon: <FaCog />,
      role: ["ADMIN"],
      submenu: [
        {
          name: "Users",
          icon: <FaUsers />,
          action: () => router.push("/master-data/user"),
          path: "/master-data/user",
        },
      ],
    },
    {
      name: "Logout",
      icon: <FaSignOutAlt />,
      action: handleLogout,
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.role || (role && item.role.includes(role))
  );

  const toggleMenu = (name) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const isActive = (path) => router.pathname === path;

  const isMenuOpen = (item) => {
    if (openMenus[item.name] !== undefined) return openMenus[item.name];
    if (item.submenu) {
      return item.submenu.some((sub) => sub.path === router.pathname);
    }
    return false;
  };

  return (
    <aside className="w-72 bg-white text-gray-800 flex flex-col shadow-lg rounded-lg transform transition-all duration-300 ease-in-out hover:shadow-3xl">
      <div className="h-16 mt-4 flex items-center justify-start font-bold text-2xl text-gray-600 px-6 py-4">
        <Image src="/images/himauntika.png" alt="Logo" width={60} height={60} />
        <span className="ml-4">HIMAUNTIKA</span>
      </div>
      <nav className="mt-4">
        {filteredMenuItems.map((item) => (
          <div key={item.name}>
            {/* Menu Utama */}
            <button
              onClick={() => {
                if (item.submenu) {
                  toggleMenu(item.name);
                } else if (item.action) {
                  item.action();
                } else {
                  handleMenuClick(item.name);
                }
              }}
              className={`flex items-center w-full p-3 mb-2 text-left rounded-lg transition duration-300 ease-in-out hover:bg-gray-100 hover:text-gray-900 ${
                isActive(item.path) ? "bg-gray-200" : ""
              }`}
            >
              <span className="text-xl mr-4">{item.icon}</span>
              <span className="text-lg flex-1">{item.name}</span>
              {item.submenu &&
                (isMenuOpen(item) ? <FaChevronUp /> : <FaChevronDown />)}
            </button>

            {/* Submenu */}
            {item.submenu && isMenuOpen(item) && (
              <div className="ml-6 mt-1">
                {item.submenu.map((sub) => (
                  <button
                    key={sub.name}
                    onClick={(e) => {
                      e.stopPropagation(); // agar tidak memicu toggle menu utama
                      sub.action();
                    }}
                    className={`flex items-center w-full p-2 mb-1 text-left rounded-lg transition duration-300 ease-in-out hover:bg-gray-100 hover:text-gray-900 ${
                      isActive(sub.path) ? "bg-gray-200" : ""
                    }`}
                  >
                    <span className="text-lg mr-3">{sub.icon}</span>
                    <span className="text-base">{sub.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
