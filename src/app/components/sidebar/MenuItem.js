import { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaHome,
  FaUsers,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";
import SubMenuItem from "./SubMenuItem";

const icons = {
  FaHome: <FaHome />,
  FaUsers: <FaUsers />,
  FaSignOutAlt: <FaSignOutAlt />,
  FaCog: <FaCog />,
};

const MenuItem = ({ item, handleMenuClick, router }) => {
  const [isOpen, setIsOpen] = useState(
    item.submenu?.some((sub) => sub.path === router.pathname) || false
  );

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path) => router.pathname === path;

  return (
    <div>
      <button
        onClick={() => {
          if (item.submenu) toggleMenu();
          else if (item.action) item.action();
          else handleMenuClick(item.name);
        }}
        className={`flex items-center w-full p-3 mb-2 text-left rounded-lg transition duration-300 ease-in-out hover:bg-gray-100 hover:text-gray-900 ${
          isActive(item.path) ? "bg-gray-200" : ""
        }`}
      >
        <span className="text-xl mr-4">{icons[item.icon]}</span>
        <span className="text-lg flex-1">{item.name}</span>
        {item.submenu && (isOpen ? <FaChevronUp /> : <FaChevronDown />)}
      </button>

      {item.submenu && isOpen && (
        <div className="ml-6 mt-1">
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
