"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const EditVisiMisiModal = ({ isOpen, onClose, item, onSave }) => {
  const [form, setForm] = useState({
    visi: "",
    misi: [],
  });

  useEffect(() => {
    if (item) {
      setForm({
        visi: item.visi || "",
        misi: Array.isArray(item.misi) ? item.misi : [],
      });
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "misi") {
      // split textarea lines menjadi array
      setForm({ ...form, misi: value.split("\n") });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Confirmation",
      text: "Save changes to this data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      onSave({ ...item, ...form });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="bg-white rounded-lg p-6 w-full max-w-md z-10">
        <h2 className="text-xl font-semibold mb-4">Edit Visi & Misi</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            name="visi"
            value={form.visi}
            onChange={handleChange}
            placeholder="Visi"
            className="w-full border p-2 rounded"
            rows={4}
            required
          />

          <textarea
            name="misi"
            value={form.misi.join("\n")}
            onChange={handleChange}
            placeholder="Misi (satu per baris)"
            className="w-full border p-2 rounded"
            rows={6}
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVisiMisiModal;
