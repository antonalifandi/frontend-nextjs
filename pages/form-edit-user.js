import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert

const EditUserModal = ({ isOpen, onClose, userData, onSave }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    // Update local state when userData changes
    if (userData) {
      setEmail(userData.email || '');
      setPassword(userData.password || '');
      setName(userData.name || '');
      setRole(userData.role || '');
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show SweetAlert for confirmation
    const result = await Swal.fire({
      title: 'Konfirmasi',
      text: "Apakah Anda yakin ingin menyimpan perubahan?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Batal',
      confirmButtonText: 'Ya, simpan!',
    });

    if (result.isConfirmed) {
      const updatedUser = {
        email,
        password,
        name,
        role,
      };

      
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('jwt='))
        ?.split('=')[1]; 

      try {
        const response = await fetch(`http://localhost:8080/users/${userData.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${document.cookie.split('access_token=')[1]}`,
          },
          body: JSON.stringify(updatedUser),
        });

        if (!response.ok) {
          throw new Error('Failed to update user');
        }

        const result = await response.json();
        console.log('User updated successfully:', result);

        onSave(updatedUser);

        onClose();

        Swal.fire(
          'Berhasil!',
          'User berhasil diperbarui.',
          'success'
        );

      } catch (error) {
        console.error('Error updating user:', error);
        Swal.fire(
          'Error!',
          'Gagal memperbarui user.',
          'error'
        );
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg p-6 z-10 shadow-lg w-1/3 mx-auto">
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Nama:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Role:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              required>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 transition duration-200 ease-in-out transform hover:bg-gray-400 active:bg-gray-600"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded transition duration-200 ease-in-out transform hover:bg-blue-700 active:bg-blue-800"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
