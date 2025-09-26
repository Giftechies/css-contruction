"use client";

import { useEffect, useState } from "react";
import {
  Pencil,
  Trash,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Check,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [postcodeQuery, setPostcodeQuery] = useState("");
  const [editPostcodeQuery, setEditPostcodeQuery] = useState("");

  // Fetch rates
  const fetchRates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/form/rates");
      const data = await res.json();
      if (data.success) setRates(data.data);
      else toast.error(data.message || "Failed to fetch rates");
    } catch (err) {
      console.error(err);
      toast.error("Error fetching rates");
    } finally {
      setLoading(false);
    }
  };

  // Fetch meta (postcodes, categories, sizes)
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
  const filteredSizes = sizes.filter((s) => s.category?._id === selectedCategory);
  const filteredSizesEdit = sizes.filter((s) => s.category?._id === editCategory);

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
      setPostcodeQuery("");
      setIsOpen(false);
      fetchRates();
    } else toast.error(data.message || "Failed to add rate");
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
      setEditPostcodeQuery("");
      fetchRates();
    } else toast.error(data.message || "Failed to update rate");
    setLoading(false);
  };

  // Delete Rate
  const handleDelete = async (id) => {
    if (!confirm("Delete this rate?")) return;
    const res = await fetch(`/api/form/rates?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) fetchRates();
    else toast.error(data.message || "Failed to delete rate");
  };

  // Filtered postcode list for search (case-insensitive)
  const filteredPostcodes = postcodes.filter((p) =>
    p.postcode.toLowerCase().includes(postcodeQuery.toLowerCase())
  );
  const filteredEditPostcodes = postcodes.filter((p) =>
    p.postcode.toLowerCase().includes(editPostcodeQuery.toLowerCase())
  );

  return (
    <section className="p-6 border border-gray-200">
      <Toaster position="top-right" />
      <h1 className="mb-4 text-2xl font-bold">Rate Management</h1>

      {/* Add Rate Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button  className=" text-white-1 mb-4">Add New Rate</Button>
        </DialogTrigger>
        <DialogOverlay className="fixed inset-0 bg-black/50" />
        <DialogContent className="w-[90%] md:w-[500px] p-4 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-center">Create New Rate</DialogTitle>
          </DialogHeader>

          <form className="flex flex-col gap-3 mt-2" onSubmit={handleCreate}>
            {/* Searchable Postcode */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between">
                  {selectedPostcode
                    ? postcodes.find((p) => p._id === selectedPostcode)?.postcode
                    : "Select Postcode"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search postcode..."
                    value={postcodeQuery}
                    onValueChange={setPostcodeQuery}
                  />
                  <CommandEmpty>No postcodes found.</CommandEmpty>
                  <CommandGroup>
                    {filteredPostcodes.map((p) => (
                      <CommandItem
                        key={p._id}
                        value={p._id}
                        onSelect={() => {
                          setSelectedPostcode(p._id);
                          setPostcodeQuery("");
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedPostcode === p._id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {p.postcode}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Category */}
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

            {/* Size */}
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
              className="bg-primary text-white-1 p-2 rounded disabled:opacity-50"
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
                    <td className="border p-2">{(currentPage - 1) * itemsPerPage + idx + 1}</td>

                    {/* Edit Postcode */}
                    <td className="border p-2">
                      {editId === r._id ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between"
                            >
                              {editPostcode
                                ? postcodes.find((p) => p._id === editPostcode)?.postcode
                                : "Select Postcode"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search postcode..."
                                value={editPostcodeQuery}
                                onValueChange={setEditPostcodeQuery}
                              />
                              <CommandEmpty>No postcodes found.</CommandEmpty>
                              <CommandGroup>
                                {filteredEditPostcodes.map((p) => (
                                  <CommandItem
                                    key={p._id}
                                    value={p._id}
                                    onSelect={() => {
                                      setEditPostcode(p._id);
                                      setEditPostcodeQuery("");
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        editPostcode === p._id ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {p.postcode}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        r.postId?.postcode
                      )}
                    </td>

                    {/* Category */}
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

                    {/* Size */}
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

                    {/* Rate */}
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

                    {/* Actions */}
                    <td className="border p-2 flex justify-center gap-2">
                      {editId === r._id ? (
                        <>
                          <Button className=" text-white-1" onClick={() => handleUpdate(r._id)} disabled={loading}>
                            Save
                          </Button>
                          <Button className=" bg-black-4 text-white-1" onClick={() => setEditId(null)}>
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
                          <Button variant="destructive" onClick={() => handleDelete(r._id)}>
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
          className=" text-white-1"
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
