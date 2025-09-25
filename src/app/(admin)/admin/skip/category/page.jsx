"use client";
import { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all categories
  const fetchCategories = async () => {
    const res = await fetch("/api/form/category");
    const data = await res.json();
    if (data.success) {
      setCategories(data.data);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategory) return;
    setLoading(true);

    const res = await fetch("/api/form/category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: newCategory }),
    });
    const data = await res.json();

    if (data.success) {
      toast.success("Category added successfully!");
      setNewCategory("");
      fetchCategories();
    } else {
      toast.error(data.error || "Failed to add category");
    }
    setLoading(false);
  };

  // Update
  const handleUpdate = async (id) => {
    if (!editValue) return;
    setLoading(true);

    const res = await fetch(`/api/form/category/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: editValue }),
    });
    const data = await res.json().then((data)=>{
        console.log(data);
           if (data.success) {
      toast.success("Category updated successfully!");
      setEditId(null);
      setEditValue("");
      fetchCategories(); // instantly update table
    } else {
      toast.error(data.error || "Failed to update category");
    }
        
        setLoading(false);
    })

 
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;

    const res = await fetch(`/api/form/category/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.success) {
      toast.success("Category deleted successfully!");
      fetchCategories();
    } else {
      toast.error(data.error || "Failed to delete category");
    }
  };

  return (
    <section className="p-6 border border-red-200">
      <Toaster position="top-right" reverseOrder={false} />

      <h1 className="mb-4 text-2xl font-bold">Category Management</h1>

      {/* Add Category */}
      <form onSubmit={handleCreate} className="mb-6 flex flex-1 justify-end gap-2 items-center">
        <input
          type="text"
          placeholder="Enter category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="w-64 rounded border p-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-primary px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      {/* Category Table */}
      <table className="w-[90%] border-collapse border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="w-[10%] p-2 border">#</th>
            <th className="w-[70%] p-2 border">Category</th>
            <th className="text-center p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, idx) => (
            <tr key={cat._id}>
              <td className="p-2 border">{idx + 1}</td>
              <td className="p-2 border">
                {editId === cat._id ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="rounded border p-1 w-full"
                  />
                ) : (
                  cat.category
                )}
              </td>
              <td className="flex justify-center gap-2 p-2 border">
                {editId === cat._id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(cat._id)}
                      disabled={loading}
                      className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditId(null);
                        setEditValue("");
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
                        setEditId(cat._id);
                        setEditValue(cat.category);
                      }}
                      className="text-blue-500 hover:text-blue-400 px-2 py-1"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-red-600 px-2 py-1"
                    >
                      <Trash size={20} />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}

          {categories.length === 0 && (
            <tr>
              <td colSpan="3" className="p-4 text-center text-gray-500">
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
