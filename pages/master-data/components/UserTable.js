"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Pencil } from "lucide-react";


const PAGE_SIZES = [10, 25, 50, 100];

const UserTable = ({ users, loading, handleDelete, handleEdit, handleAdd }) => {
  const [sortBy, setSortBy] = useState("email");
  const [sortOrder, setSortOrder] = useState("asc");

  // Handle sort click
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  // Filter search
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      [user.email, user.name, user.role]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [users, search]);

  // Sort A-Z / Z-A
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const valueA = a[sortBy]?.toString().toLowerCase();
      const valueB = b[sortBy]?.toString().toLowerCase();

      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, page, pageSize]);

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p>Loading...</p>
      </div>
    );
  }

 return (
   <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col gap-6">
     {/* Header */}
     <div className="flex justify-between items-center mb-2">
       <h2 className="text-2xl font-bold text-gray-800">Master Data User</h2>
     </div>

     {/* Top controls: Search & Add */}
     <div className="flex flex-wrap items-center justify-between gap-3">
       <Input
         placeholder="Search email, nama, role..."
         value={search}
         onChange={(e) => {
           setSearch(e.target.value);
           setPage(1);
         }}
         className="max-w-sm"
       />

       <div className="flex items-center gap-3">
         <select
           value={pageSize}
           onChange={(e) => {
             setPageSize(Number(e.target.value));
             setPage(1);
           }}
           className="border rounded-md px-3 py-2 text-sm"
         >
           {PAGE_SIZES.map((size) => (
             <option key={size} value={size}>
               Show {size}
             </option>
           ))}
         </select>

         <Button onClick={handleAdd}>+ Add Users</Button>
       </div>
     </div>

     {/* Table */}
     <div className="overflow-auto">
       <Table>
         <TableHeader>
           <TableRow>
             <TableHead>No</TableHead>
             <TableHead
               className="cursor-pointer"
               onClick={() => handleSort("email")}
             >
               Email {sortBy === "email" && (sortOrder === "asc" ? "▲" : "▼")}
             </TableHead>
             <TableHead
               className="cursor-pointer"
               onClick={() => handleSort("name")}
             >
               Nama {sortBy === "name" && (sortOrder === "asc" ? "▲" : "▼")}
             </TableHead>
             <TableHead
               className="cursor-pointer"
               onClick={() => handleSort("role")}
             >
               Role {sortBy === "role" && (sortOrder === "asc" ? "▲" : "▼")}
             </TableHead>
             <TableHead className="text-center">Action</TableHead>
           </TableRow>
         </TableHeader>
         <TableBody>
           {paginatedUsers.length === 0 ? (
             <TableRow>
               <TableCell colSpan={5} className="text-center text-gray-500">
                 Data tidak ditemukan
               </TableCell>
             </TableRow>
           ) : (
             paginatedUsers.map((user, index) => (
               <TableRow key={user.id}>
                 <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                 <TableCell>{user.email}</TableCell>
                 <TableCell>{user.name}</TableCell>
                 <TableCell>{user.role}</TableCell>
                 <TableCell className="text-center space-x-2">
                   <Button
                     variant="ghost"
                     size="icon"
                     onClick={() => handleEdit(user)}
                   >
                     <Pencil className="h-4 w-4 text-blue-500" />
                   </Button>
                   <Button
                     variant="ghost"
                     size="icon"
                     onClick={() => handleDelete(user.id)}
                   >
                     <Trash2 className="h-4 w-4 text-red-500" />
                   </Button>
                 </TableCell>
               </TableRow>
             ))
           )}
         </TableBody>
       </Table>
     </div>

     {/* Pagination */}
     <div className="flex items-center justify-between text-sm">
       <p>
         Page {page} of {totalPages || 1}
       </p>

       <div className="space-x-2">
         <Button
           variant="outline"
           size="sm"
           disabled={page === 1}
           onClick={() => setPage((p) => p - 1)}
         >
           Previous
         </Button>
         <Button
           variant="outline"
           size="sm"
           disabled={page === totalPages || totalPages === 0}
           onClick={() => setPage((p) => p + 1)}
         >
           Next
         </Button>
       </div>
     </div>
   </div>
 );
};

export default UserTable;
