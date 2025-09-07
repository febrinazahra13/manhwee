import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Manhwa, ManhwaType, Status, ManhwaDraft } from "../types";

export default function NewManhwa() {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useLocalStorage<Manhwa[]>("manhwee:data", []);

  // Detect edit mode from location.state
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
      setForm({
        title: editItem.title,
        author: editItem.author,
        type: editItem.type,
        genres: editItem.genres,
        status: editItem.status,
        rating: editItem.rating,
        cover: editItem.cover,
        link: editItem.link,
        notes: editItem.notes,
        currentChapter: editItem.currentChapter,
        totalChapters: editItem.totalChapters,
        startedAt: editItem.startedAt,
        finishedAt: editItem.finishedAt,
      });
    }
  }, [editItem]);

  const handleChange = (key: keyof ManhwaDraft, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toManhwa = (draft: ManhwaDraft): Manhwa => ({
    id: editItem?.id || crypto.randomUUID(),
    title: draft.title?.trim() || "Untitled",
    author: draft.author?.trim() || "Unknown",
    type: draft.type as ManhwaType | undefined,
    genres: (draft.genres as string[]) || [],
    status: (draft.status as Status) || "Not Started",
    rating: draft.rating
      ? (Number(draft.rating) as 1 | 2 | 3 | 4 | 5)
      : undefined,
    cover: draft.cover?.trim() || "",
    link: draft.link?.trim() || "",
    notes: draft.notes?.trim() || "",
    currentChapter: draft.currentChapter
      ? Number(draft.currentChapter)
      : undefined,
    totalChapters: draft.totalChapters
      ? Number(draft.totalChapters)
      : undefined,
    startedAt: draft.startedAt?.toString(),
    finishedAt: draft.finishedAt?.toString(),
    endDate: undefined
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newManhwa = toManhwa(form);

    if (editItem) {
      const updatedItems = items.map((i) =>
        i.id === editItem.id ? newManhwa : i
      );
      setItems(updatedItems);
    } else {
      setItems([...items, newManhwa]);
    }

    navigate("/app");
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

        {/* Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={form.type || ""}
            onChange={(e) => handleChange("type", e.target.value as ManhwaType)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Select Type</option>
            <option value="Shoujo (G)">Shoujo (Girls)</option>
            <option value="Shounen (B)">Shounen (Boys)</option>
            <option value="Josei (W)">Josei (Women)</option>
            <option value="Seinen (M)">Seinen (Men)</option>
            <option value="Yuri (GL)">Yuri (Girls’ Love)</option>
            <option value="Yaoi (BL)">Yaoi (Boys’ Love)</option>
            <option value="Bara (ML)">Bara (Male Love)</option>
            <option value="Kodomo (Kid)">Kodomo (Kids)</option>
            <option value="Silver & Golden">Silver & Golden</option>
            <option value="Non-Human">Non-Human</option>
          </select>
        </div>

        {/* Genres */}
        <div>
          <label>Genres (comma-separated)</label>
          <input
            type="text"
            value={(form.genres as string[]).join(", ") || ""}
            onChange={(e) =>
              handleChange(
                "genres",
                e.target.value.split(",").map((g) => g.trim())
              )
            }
            className="w-full p-2 border rounded-lg"
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
            <option value="In Progress">In Progress</option>
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

        {/* Current Chapter */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Current Chapter
          </label>
          <input
            type="number"
            min={1}
            value={form.currentChapter || ""}
            onChange={(e) => handleChange("currentChapter", e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Total Chapters */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Total Chapters
          </label>
          <input
            type="number"
            min={1}
            value={form.totalChapters || ""}
            onChange={(e) => handleChange("totalChapters", e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Started At */}
        <div>
          <label className="block text-sm font-medium mb-1">Started At</label>
          <input
            type="date"
            value={form.startedAt || ""}
            onChange={(e) => handleChange("startedAt", e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Finished At */}
        <div>
          <label className="block text-sm font-medium mb-1">Finished At</label>
          <input
            type="date"
            value={form.finishedAt || ""}
            onChange={(e) => handleChange("finishedAt", e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Manhwa Link */}
        <div>
          <label className="block text-sm font-medium mb-1">Manhwa Link</label>
          <input
            type="url"
            value={form.link || ""}
            onChange={(e) => handleChange("link", e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="https://webtoons.com/..."
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