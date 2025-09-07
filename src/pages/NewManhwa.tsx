import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import type { Manhwa, ManhwaType, Status, ManhwaDraft } from "../types";

export default function NewManhwa() {
  const navigate = useNavigate();
  const location = useLocation();

  const editItem = (location.state as { editItem?: Manhwa })?.editItem;

  const [form, setForm] = useState<ManhwaDraft>({
    title: "",
    author: "",
    type: undefined,
    genres: [],
    status: "Not Started",
    rating: undefined,
    cover: "",
    link: "",
    notes: "",
    currentChapter: undefined,
    totalChapters: undefined,
    startedAt: "",
    finishedAt: "",
  });

  // Prefill form if editing
  useEffect(() => {
    if (editItem) {
      setForm(editItem);
    }
  }, [editItem]);

  const handleChange = (key: keyof ManhwaDraft, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("You must be logged in!");
      return;
    }

    const manhwaId = editItem?.id || crypto.randomUUID();
    const uid = auth.currentUser.uid;

    const newManhwa: Manhwa = {
      id: manhwaId,
      uid,
      title: form.title?.toString().trim() || "Untitled",
      author: form.author?.toString().trim() || "Unknown",
      type: form.type as ManhwaType | undefined,
      genres: (form.genres as string[]) || [],
      status: (form.status as Status) || "Not Started",
      rating: form.rating ? (Number(form.rating) as 1 | 2 | 3 | 4 | 5) : undefined,
      cover: form.cover?.toString().trim() || "",
      link: form.link?.toString().trim() || "",
      notes: form.notes?.toString().trim() || "",
      currentChapter: form.currentChapter ? Number(form.currentChapter) : undefined,
      totalChapters: form.totalChapters ? Number(form.totalChapters) : undefined,
      startedAt: form.startedAt?.toString(),
      finishedAt: form.finishedAt?.toString(),
      endDate: (form as any).endDate || undefined, // keep if needed
    };

    try {
      await setDoc(doc(db, "manhwee", manhwaId), newManhwa);
      navigate("/app");
    } catch (error) {
      console.error("Error saving manhwa:", error);
      alert("Failed to save. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {editItem ? "Edit Manhwa" : "Add New Manhwa"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={form.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium mb-1">Author</label>
          <input
            type="text"
            value={form.author || ""}
            onChange={(e) => handleChange("author", e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Cover URL */}
        <div>
          <label className="block text-sm font-medium mb-1">Cover URL</label>
          <input
            type="url"
            value={form.cover || ""}
            onChange={(e) => handleChange("cover", e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="https://example.com/cover.jpg"
          />
          {form.cover && (
            <img
              src={form.cover}
              alt="Cover Preview"
              className="mt-2 w-32 h-48 object-cover rounded-lg shadow"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/128x192?text=No+Image";
              }}
            />
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={form.status || "Not Started"}
            onChange={(e) => handleChange("status", e.target.value as Status)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="Not Started">Not Started</option>
            <option value="Reading">Reading</option>
            <option value="Completed">Completed</option>
            <option value="Dropped">Dropped</option>
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-1">Rating</label>
          <select
            value={form.rating || ""}
            onChange={(e) => handleChange("rating", e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">No Rating</option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r} ⭐
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            value={form.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
            className="w-full p-2 border rounded-lg"
            rows={4}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/app")}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {editItem ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}