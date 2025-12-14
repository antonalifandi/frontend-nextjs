import { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaHome,
  FaUsers,
  FaPencilAlt,
  FaDatabase,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";
import SubMenuItem from "./SubMenuItem";

const icons = {
  FaHome: <FaHome />,
  FaUsers: <FaUsers />,
  FaPencilAlt: <FaPencilAlt />,
  FaDatabase: <FaDatabase />,
  FaSignOutAlt: <FaSignOutAlt />,
  FaCog: <FaCog />,
};

const MenuItem = ({
  item,
  handleMenuClick,
  router,
  isSidebarOpen,
  setSidebarOpen,
}) => {
  const [isOpen, setIsOpen] = useState(
    item.submenu?.some((sub) => sub.path === router.pathname) || false
  );

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path) => router.pathname === path;

  return (
    <div>
      <button
        onClick={() => {
          if (!isSidebarOpen) {
            setSidebarOpen(true);
            return;
          }
          if (item.submenu) toggleMenu();
          else if (item.action) item.action();
        }}
        className={`flex items-center w-full py-2 px-3 mb-1 rounded-lg transition hover:bg-gray-100 ${
          isActive(item.path) ? "bg-gray-200" : ""
        }`}
      >
        {/* ICON */}
        <span
          className={`
    text-lg flex items-center justify-center
    ${isSidebarOpen ? "w-5 mr-3" : "w-full"}
  `}
        >
          {icons[item.icon]}
        </span>

        {/* TEXT + CHEVRON */}
        <div
          className={`
    flex items-center justify-between flex-1 gap-3
    overflow-hidden
    transition-all duration-300 ease-in-out
    ${
      isSidebarOpen
        ? "opacity-100 max-w-full translate-x-0"
        : "opacity-0 max-w-0 -translate-x-2"
    }
  `}
        >
          <span className="text-base whitespace-nowrap">{item.name}</span>

          {item.submenu && (
            <span
              className={`
        text-sm transition-transform duration-300
        ${isSidebarOpen ? "rotate-0" : "rotate-90"}
      `}
            >
              {isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          )}
        </div>
      </button>

      {item.submenu && (
        <div
          className={`
      ml-6 mt-1
      overflow-hidden
      transition-all duration-300 ease-in-out
      ${
        isOpen && isSidebarOpen
          ? "max-h-40 opacity-100 translate-y-0"
          : "max-h-0 opacity-0 -translate-y-1"
      }
    `}
        >
          {item.submenu.map((sub) => (
            <SubMenuItem
              key={sub.name}
              sub={{ ...sub, icon: icons[sub.icon] }}
              router={router}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItem;
