import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import EditUserModal from './form-edit-user';

const Dashboard = () => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedUser, setSelectedUser] = useState(null);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    if (menu === 'Master Data Users') {
      fetchUsers(); 
    }
  };

  const handleLogout = () => {
    document.cookie = 'access_token=; Max-Age=0; path=/'; 
    router.push('/login');
  };

  const handleEdit = (userId) => {
    const user = users.find(user => user.id === userId);
    setSelectedUser(user); 
    setIsModalOpen(true); 
  };

  const handleSave = async (updatedUser) => {
    console.log('Updating user:', updatedUser);
    fetchUsers();
  };

  const fetchUsers = async () => {
    setLoading(true); 
    try {
      const response = await fetch('http://localhost:8080/users/master-data', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${document.cookie.split('access_token=')[1]}`, 
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data); 
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false); 
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: '🏠' },
    { name: 'Master Data Users', icon: '👤' },
    { name: 'Settings', icon: '⚙️' },
    { name: 'Analytics', icon: '📊' },
    { name: 'Logout', icon: '🚪', action: handleLogout }, 
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white">
        <div className="h-16 flex items-center justify-center font-bold text-2xl border-b border-blue-800">
          MyApp
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                if (item.name === 'Logout') {
                  item.action();
                } else {
                  handleMenuClick(item.name);
                }
              }}
              className={`flex items-center w-full p-4 text-left hover:bg-blue-500 transition ${
                activeMenu === item.name ? 'bg-blue-700' : ''
              }`}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              <span className="text-lg">{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center bg-white shadow-md p-4 rounded-md">
          <h1 className="text-2xl font-semibold text-gray-800">Welcome, User!</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Notifications</span>
            <span className="text-gray-600">Profile</span>
          </div>
        </header>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{activeMenu}</h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            {/* Tempat konten sesuai menu yang aktif */}
            {activeMenu === 'Dashboard' && (
              <p>Ini adalah halaman Dashboard utama!</p>
            )}
            {activeMenu === 'Master Data Users' && (
              <div>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b border-gray-300 text-left">No</th>
                        <th className="py-2 px-4 border-b border-gray-300 text-left">Email User</th>
                        <th className="py-2 px-4 border-b border-gray-300 text-left">Nama User</th>
                        <th className="py-2 px-4 border-b border-gray-300 text-left">Role</th>
                        <th className="py-2 px-4 border-b border-gray-300 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="py-2 px-4 border-b border-gray-300">{index + 1}</td>
                          <td className="py-2 px-4 border-b border-gray-300">{user.email}</td>
                          <td className="py-2 px-4 border-b border-gray-300">{user.name}</td>
                          <td className="py-2 px-4 border-b border-gray-300">{user.role}</td>
                          <td className="py-2 px-4 border-b border-gray-300">
                            {/* Tombol Edit */}
                            <button onClick={() => handleEdit(user.id)} className="text-blue-600 hover:text-blue-800">
                                <i className="fas fa-edit"></i> {/* Ikon edit Font Awesome */}
                            </button>
                            {/* Tombol Hapus */}
                            <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800 ml-4">
                                <i className="fas fa-trash"></i> {/* Ikon hapus Font Awesome */}
                            </button>
                            </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Edit Pengguna */}
        <EditUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userData={selectedUser || {}}
          onSave={handleSave}
        />
      </main>
    </div>
  );
};

export default Dashboard;
