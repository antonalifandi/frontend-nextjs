import { FaUsers } from "react-icons/fa"; 

const SubMenuItem = ({ sub, router }) => {
  const isActive = (path) => router.pathname === path;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); 
        sub.action();
      }}
      className={`flex items-center w-full p-2 mb-1 text-left rounded-lg transition duration-300 ease-in-out hover:bg-gray-100 hover:text-gray-900 ${
        isActive(sub.path) ? "bg-gray-200" : ""
      }`}
    >
      <span className="text-lg mr-3">{sub.icon}</span>
      <span className="text-base">{sub.name}</span>
    </button>
  );
};

export default SubMenuItem;
