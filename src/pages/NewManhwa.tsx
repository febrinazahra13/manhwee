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

  // Prefill when editing
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

    try {
      const manhwaId = editItem?.id || Date.now().toString();

      const newManhwa: Manhwa = {
        id: manhwaId,
        uid: auth.currentUser.uid,
        title: form.title?.toString().trim() || "Untitled",
        author: form.author?.toString().trim() || "Unknown",
        type: form.type as ManhwaType | undefined,
        genres: (form.genres as string[]) || [],
        status: (form.status as Status) || "Not Started",
        rating: form.rating && !isNaN(Number(form.rating))
          ? (Number(form.rating) as 1 | 2 | 3 | 4 | 5)
          : undefined,
        cover: form.cover?.toString().trim() || "",
        link: form.link?.toString().trim() || "",
        notes: form.notes?.toString().trim() || "",
        currentChapter: form.currentChapter && !isNaN(Number(form.currentChapter))
          ? Number(form.currentChapter)
          : undefined,
        totalChapters: form.totalChapters && !isNaN(Number(form.totalChapters))
          ? Number(form.totalChapters)
          : undefined,
        startedAt: form.startedAt || undefined,
        finishedAt: form.finishedAt || undefined,
        endDate: undefined
      };

      // Remove empty values
      const cleanObject: any = Object.fromEntries(
        Object.entries(newManhwa).filter(
          ([_, v]) => v !== undefined && v !== null && v !== ""
        )
      );
      cleanObject.id = manhwaId;
      cleanObject.uid = auth.currentUser.uid;

      // Save or update
      await setDoc(doc(db, "manhwee", manhwaId), cleanObject, { merge: true });

      // 🔹 Go back to dashboard (realtime listener akan otomatis update)
      navigate("/app");
    } catch (error: any) {
      console.error("Error saving manhwa:", error);
      alert("Failed to save: " + error.message);
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

        {/* Cover */}
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
              alt="Preview"
              className="mt-2 w-32 h-48 object-cover rounded-lg shadow"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/128x192?text=No+Image";
              }}
            />
          )}
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={form.type || ""}
            onChange={(e) =>
              handleChange("type", e.target.value as ManhwaType)
            }
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Select Type</option>
            <option value="Shoujo (G)">Shoujo (G)</option>
            <option value="Shounen (B)">Shounen (B)</option>
            <option value="Josei (W)">Josei (W)</option>
            <option value="Seinen (M)">Seinen (M)</option>
            <option value="Yuri (GL)">Yuri (GL)</option>
            <option value="Yaoi (BL)">Yaoi (BL)</option>
          </select>
        </div>

        {/* Genres */}
        <div>
          <label className="block text-sm font-medium mb-1">Genres</label>
          <input
            type="text"
            value={Array.isArray(form.genres) ? form.genres.join(", ") : ""}
            onChange={(e) =>
              handleChange(
                "genres",
                e.target.value.split(",").map((g) => g.trim())
              )
            }
            className="w-full p-2 border rounded-lg"
            placeholder="Action, Romance, Fantasy"
          />
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
            onChange={(e) => handleChange("rating", Number(e.target.value))}
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

        {/* Current Chapter */}
        <div>
          <label className="block text-sm font-medium mb-1">Current Chapter</label>
          <input
            type="number"
            value={form.currentChapter || ""}
            onChange={(e) =>
              handleChange(
                "currentChapter",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Total Chapters */}
        <div>
          <label className="block text-sm font-medium mb-1">Total Chapters</label>
          <input
            type="number"
            value={form.totalChapters || ""}
            onChange={(e) =>
              handleChange(
                "totalChapters",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Dates */}
        <div>
          <label className="block text-sm font-medium mb-1">Started At</label>
          <input
            type="date"
            value={form.startedAt || ""}
            onChange={(e) => handleChange("startedAt", e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Finished At</label>
          <input
            type="date"
            value={form.finishedAt || ""}
            onChange={(e) => handleChange("finishedAt", e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Link */}
        <div>
          <label className="block text-sm font-medium mb-1">Link</label>
          <input
            type="url"
            value={form.link || ""}
            onChange={(e) => handleChange("link", e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="https://example.com"
          />
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