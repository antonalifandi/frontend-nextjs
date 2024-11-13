import React from "react";
const UserTable = ({ users, loading, handleDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b border-gray-300 text-left">
                No
              </th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">
                Email User
              </th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">
                Nama User
              </th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">
                Role
              </th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-gray-300">
                  {index + 1}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {user.email}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {user.name}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {user.role}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {/* <button
                    onClick={() => handleEdit(user.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <i className="fas fa-edit h-5 w-5"></i>
                  </button> */}
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <i className="fas fa-trash h-5 w-5"></i> {/* Ikon delete */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserTable;
