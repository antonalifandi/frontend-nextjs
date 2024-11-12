import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

const Sidebar = ({ activeMenu, handleMenuClick, handleLogout }) => {
  const router = useRouter();

  const menuItems = [
    {
      name: "Dashboard",
      icon: "home",
      action: () => router.push("/dashboard"),
      path: "/dashboard",
    },
    {
      name: "Master Data Users",
      icon: "users",
      action: () => router.push("/datauser"),
      path: "/datauser",
    },
    { name: "Settings", icon: "cog", path: "/settings" },
    { name: "Analytics", icon: "chart-bar", path: "/analytics" },
    { name: "Logout", icon: "logout", action: handleLogout },
  ];

  return (
    <aside className="w-64 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="h-16 flex items-center justify-center font-bold text-2xl border-b border-blue-800">
        <Image
          src="/images/logo-bening-guru-semesta.png"
          alt="Logo"
          width={300}
          height={60}
        />
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => {
              if (item.action) {
                item.action();
              } else {
                handleMenuClick(item.name);
              }
            }}
            className={`flex items-center w-full p-4 text-left hover:bg-blue-500 transition ${
              router.pathname === item.path ? "bg-blue-700" : ""
            }`}
          >
            <span className="text-lg mr-3">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {/* Icon berdasarkan item.icon */}
              </svg>
            </span>
            <span className="text-lg">{item.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
