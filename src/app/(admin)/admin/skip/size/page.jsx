"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function SizePage() {
  const [sizes, setSizes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newSize, setNewSize] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [editSize, setEditSize] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all sizes
  const fetchSizes = async () => {
    const res = await fetch("/api/form/size");
    const data = await res.json();
    if (data.success) setSizes(data.data);
  };

  // Fetch all categories
  const fetchCategories = async () => {
    const res = await fetch("/api/form/category");
    const data = await res.json();
    if (data.success) setCategories(data.data);
  };

  useEffect(() => {
    fetchSizes();
    fetchCategories();
  }, []);

  // Create size
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newSize || !selectedCategory) return toast.error("Fill all fields");
    setLoading(true);

    const res = await fetch("/api/form/size", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ size: newSize, categoryId: selectedCategory }),
    });
    const data = await res.json();

    if (data.success) {
      toast.success("Size added successfully");
      setNewSize("");
      setSelectedCategory("");
      fetchSizes();
    } else {
      toast.error(data.message || "Failed to add size");
    }
    setLoading(false);
  };

  // Update size
  const handleUpdate = async (id) => {
    if (!editSize || !editCategory) return toast.error("Fill all fields");
    setLoading(true);

    const res = await fetch("/api/form/size", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, size: editSize, categoryId: editCategory }),
    });
    const data = await res.json();

    if (data.success) {
      toast.success("Size updated successfully");
      setEditId(null);
      setEditSize("");
      setEditCategory("");
      fetchSizes();
    } else {
      toast.error(data.message || "Failed to update size");
    }
    setLoading(false);
  };

  // Delete size
  const handleDelete = async (id) => {
    if (!confirm("Delete this size?")) return;
    const res = await fetch(`/api/form/size?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      toast.success("Size deleted successfully");
      fetchSizes();
    } else {
      toast.error(data.message || "Failed to delete size");
    }
  };

  return (
    <section className="p-6 border border-gray-200">
      <Toaster position="top-right" reverseOrder={false} />

      <h1 className="mb-4 text-2xl font-bold">Size Management</h1>

      {/* Add Size Form */}
      <form
        onSubmit={handleCreate}
        className="mb-6 flex flex-wrap gap-2 items-center justify-end "
      >
        <input
          type="text"
          placeholder="Enter size"
          value={newSize}
          onChange={(e) => setNewSize(e.target.value)}
          className="rounded border p-2 w-64"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded border p-2"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.category}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-primary px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Size"}
        </button>
      </form>

      {/* Sizes Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border w-[5%]">#</th>
            <th className="p-2 border w-[35%]">Size</th>
            <th className="p-2 border w-[35%]">Category</th>
            <th className="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sizes.map((size, idx) => (
            <tr key={size._id}>
              <td className="p-2 border">{idx + 1}</td>

              <td className="p-2 border">
                {editId === size._id ? (
                  <input
                    type="text"
                    value={editSize}
                    onChange={(e) => setEditSize(e.target.value)}
                    className="rounded border p-1 w-full"
                  />
                ) : (
                  size.size
                )}
              </td>

              <td className="p-2 border">
                {editId === size._id ? (
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="rounded border p-1 w-full"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.category}
                      </option>
                    ))}
                  </select>
                ) : (
                  size.category?.category || "N/A"
                )}
              </td>

              <td className="p-2 border flex justify-center gap-2">
                {editId === size._id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(size._id)}
                      disabled={loading}
                      className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditId(null);
                        setEditSize("");
                        setEditCategory("");
                      }}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditId(size._id);
                        setEditSize(size.size);
                        setEditCategory(size.category?._id || "");
                      }}
                      className="text-blue-500 hover:text-blue-400 px-2 py-1"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(size._id)}
                      className="text-red-600 px-2 py-1"
                    >
                      <Trash size={20} />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}

          {sizes.length === 0 && (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No sizes found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
