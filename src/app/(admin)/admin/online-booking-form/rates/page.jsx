"use client";

import { useEffect, useState } from "react";
import {
  Pencil,
  Trash,
  SearchIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";
import {Skeleton} from "@/components/ui/skeleton"; // Shadcn Skeleton component

export default function RatePage() {
  const [rates, setRates] = useState([]);
  const [postcodes, setPostcodes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [newRate, setNewRate] = useState("");
  const [selectedPostcode, setSelectedPostcode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const [editId, setEditId] = useState(null);
  const [editRate, setEditRate] = useState("");
  const [editPostcode, setEditPostcode] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editSize, setEditSize] = useState("");

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch all rates
const fetchRates = async () => {
  setLoading(true);
  try {
    const res = await fetch("/api/form/rates"); // fetch API
    console.log(res.ok, "fecthrate"); // true/false
    const data = await res.json(); // parse JSON from response
    console.log(data, "fecthrate>>>"); // the actual JSON

    if (data.success) {
      setRates(data.data); // store rates in state
    } else {
      toast.error(data.message || "Failed to fetch rates");
    }
  } catch (error) {
    console.error("Fetch rates error:", error);
    toast.error("Something went wrong while fetching rates");
  } finally {
    setLoading(false);
  }
};


  // Fetch all postcodes, categories, sizes
  const fetchMeta = async () => {
    const [postRes, catRes, sizeRes] = await Promise.all([
      fetch("/api/form/postcode"),
      fetch("/api/form/category"),
      fetch("/api/form/size"),
    ]);
    const [postData, catData, sizeData] = await Promise.all([
      postRes.json(),
      catRes.json(),
      sizeRes.json(),
    ]);
    if (postData) setPostcodes(postData);
    if (catData.success) setCategories(catData.data);
    if (sizeData.success) setSizes(sizeData.data);
  };

  useEffect(() => {
    fetchRates();
    fetchMeta();
  }, []);

  // Filter sizes by selected category
  const filteredSizes = sizes.filter(
    (s) => s.category?._id === selectedCategory
  );

  const filteredSizesEdit = sizes.filter(
    (s) => s.category?._id === editCategory
  );

  // Pagination
  const totalPages = Math.ceil(rates.length / itemsPerPage);
  const paginatedRates = rates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Create Rate
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!selectedPostcode || !selectedCategory || !selectedSize || !newRate)
      return toast.error("All fields are required");
    setLoading(true);

    const res = await fetch("/api/form/rates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: selectedPostcode,
        categoryId: selectedCategory,
        sizeId: selectedSize,
        rate: newRate,
      }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Rate added successfully");
      setNewRate("");
      setSelectedPostcode("");
      setSelectedCategory("");
      setSelectedSize("");
      setIsOpen(false);
      fetchRates();
    } else {
      toast.error(data.message || "Failed to add rate");
    }
    setLoading(false);
  };

  // Update Rate
  const handleUpdate = async (id) => {
    if (!editPostcode || !editCategory || !editSize || !editRate)
      return toast.error("All fields are required");
    setLoading(true);

    const res = await fetch("/api/form/rates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        postId: editPostcode,
        categoryId: editCategory,
        sizeId: editSize,
        rate: editRate,
      }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Rate updated successfully");
      setEditId(null);
      setEditPostcode("");
      setEditCategory("");
      setEditSize("");
      setEditRate("");
      fetchRates();
    } else {
      toast.error(data.message || "Failed to update rate");
    }
    setLoading(false);
  };

  // Delete Rate
  const handleDelete = async (id) => {
    if (!confirm("Delete this rate?")) return;
    const res = await fetch(`/api/form/rates?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      toast.success("Rate deleted successfully");
      fetchRates();
    } else {
      toast.error(data.message || "Failed to delete rate");
    }
  };

  return (
    <section className="p-6 border border-gray-200">
      <Toaster position="top-right" />
      <h1 className="mb-4 text-2xl font-bold">Rate Management</h1>

      {/* Add Rate */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4 text-white-1">Add New Rate</Button>
        </DialogTrigger>
        <DialogOverlay className="fixed inset-0 bg-black-4/50" />
        <DialogContent className="w-[90%] md:w-[500px] p-4 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-center">Create New Rate</DialogTitle>
          </DialogHeader>

          <form className="flex flex-col gap-3 mt-2" onSubmit={handleCreate}>
            <select
              required
              value={selectedPostcode}
              onChange={(e) => setSelectedPostcode(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Select Postcode</option>
              {postcodes.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.postcode}
                </option>
              ))}
            </select>

            <select
              required
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSize("");
              }}
              className="p-2 border rounded"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.category}
                </option>
              ))}
            </select>

            <select
              required
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Select Size</option>
              {filteredSizes.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.size}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Enter Rate"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              className="p-2 border rounded"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white p-2 rounded disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Rate"}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2 w-[5%]">#</th>
              <th className="border p-2 w-[20%]">Postcode</th>
              <th className="border p-2 w-[20%]">Category</th>
              <th className="border p-2 w-[20%]">Size</th>
              <th className="border p-2 w-[15%]">Rate</th>
              <th className="border p-2 text-center w-[20%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: itemsPerPage }).map((_, idx) => (
                  <tr key={idx}>
                    <td colSpan={6}>
                      <Skeleton className="h-8 my-1 rounded" />
                    </td>
                  </tr>
                ))
              : paginatedRates.map((r, idx) => (
                  <tr key={r._id}>
                    <td className="border p-2">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="border p-2">
                      {editId === r._id ? (
                        <select
                          value={editPostcode}
                          onChange={(e) => setEditPostcode(e.target.value)}
                          className="p-1 border rounded w-full"
                        >
                          {postcodes.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.postcode}
                            </option>
                          ))}
                        </select>
                      ) : (
                        r.postId?.postcode
                      )}
                    </td>
                    <td className="border p-2">
                      {editId === r._id ? (
                        <select
                          value={editCategory}
                          onChange={(e) => {
                            setEditCategory(e.target.value);
                            setEditSize("");
                          }}
                          className="p-1 border rounded w-full"
                        >
                          {categories.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.category}
                            </option>
                          ))}
                        </select>
                      ) : (
                        r.categoryId?.category
                      )}
                    </td>
                    <td className="border p-2">
                      {editId === r._id ? (
                        <select
                          value={editSize}
                          onChange={(e) => setEditSize(e.target.value)}
                          className="p-1 border rounded w-full"
                        >
                          {filteredSizesEdit.map((s) => (
                            <option key={s._id} value={s._id}>
                              {s.size}
                            </option>
                          ))}
                        </select>
                      ) : (
                        r.sizeId?.size
                      )}
                    </td>
                    <td className="border p-2">
                      {editId === r._id ? (
                        <input
                          type="number"
                          value={editRate}
                          onChange={(e) => setEditRate(e.target.value)}
                          className="p-1 border rounded w-full"
                        />
                      ) : (
                        r.rate
                      )}
                    </td>
                    <td className="border p-2 flex justify-center gap-2">
                      {editId === r._id ? (
                        <>
                          <Button
                            onClick={() => handleUpdate(r._id)}
                            disabled={loading}
                          >
                            Save
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => setEditId(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditId(r._id);
                              setEditPostcode(r.postId?._id || "");
                              setEditCategory(r.categoryId?._id || "");
                              setEditSize(r.sizeId?._id || "");
                              setEditRate(r.rate);
                            }}
                          >
                            <Pencil size={18} />
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(r._id)}
                          >
                            <Trash size={18} />
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
            {!loading && paginatedRates.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No rates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft />
        </Button>
        {[...Array(totalPages)].map((_, idx) => (
          <Button
            key={idx}
            variant={currentPage === idx + 1 ? "default" : "outline"}
            onClick={() => goToPage(idx + 1)}
          >
            {idx + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight />
        </Button>
      </div>
    </section>
  );
}
