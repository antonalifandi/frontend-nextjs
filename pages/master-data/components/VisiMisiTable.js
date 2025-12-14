"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil } from "lucide-react";

const VisiMisiTable = ({ items = [], handleEdit }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Visi</TableHead>
          <TableHead>Misi</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-gray-500">
              Data tidak ditemukan
            </TableCell>
          </TableRow>
        ) : (
          items.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{item.visi}</TableCell>
              <TableCell>
                <ul className="list-disc pl-5">
                  {item.misi.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(item)}
                >
                  <Pencil className="h-4 w-4 text-blue-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default VisiMisiTable;
