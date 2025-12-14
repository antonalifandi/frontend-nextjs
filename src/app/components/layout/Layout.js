import Sidebar from "../sidebar";

const Layout = ({ children, handleMenuClick, handleLogout }) => {
  return (
    <div className="flex h-screen min-h-screen bg-gray-100">
      {/* Sidebar kiri */}
      <Sidebar handleMenuClick={handleMenuClick} handleLogout={handleLogout} />

      {/* Bagian utama */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white shadow-md flex items-center px-6">
          bagian header ini
        </header>

        {/* Konten utama */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
