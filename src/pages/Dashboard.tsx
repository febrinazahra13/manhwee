import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, BarChart2, User, LogOut, Plus } from "lucide-react";
import DetailModal from "../components/DetailModal";
import type { Manhwa } from "../types";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Dashboard() {
  const [items, setItems] = useState<Manhwa[]>([]);
  const [activeItem, setActiveItem] = useState<Manhwa | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    item: Manhwa | null;
  }>({ visible: false, x: 0, y: 0, item: null });

  const [sortBy, setSortBy] = useState("recent");
  const [filter, setFilter] = useState({ type: "", status: "", rating: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // 🔑 Auth & Realtime Firestore
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoading(false);
        navigate("/");
        return;
      }

      const q = query(collection(db, "manhwee"), where("uid", "==", user.uid));
      const unsubscribeSnap = onSnapshot(q, (snapshot) => {
        const manhwas = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Manhwa[];
        setItems(manhwas);
        setLoading(false);
      });

      return () => unsubscribeSnap();
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  // Close context menu on click outside
  useEffect(() => {
    const handleClick = () =>
      setContextMenu((prev) => ({ ...prev, visible: false }));
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // 🔥 Delete from Firestore
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this manhwa?")) {
      try {
        await deleteDoc(doc(db, "manhwee", id));
      } catch (err) {
        console.error("Failed to delete:", err);
        alert("Failed to delete manhwa.");
      }
    }
  };

  const handleEdit = (item: Manhwa) => {
    navigate("/new", { state: { editItem: item } });
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // --- Derived Data: Sorting + Filtering + Search ---
  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === "title-asc") return a.title.localeCompare(b.title);
    if (sortBy === "title-desc") return b.title.localeCompare(a.title);
    return b.id.localeCompare(a.id); // recent (by id)
  });

  const filteredItems = sortedItems.filter((item) => {
    if (filter.type && item.type !== filter.type) return false;
    if (filter.status && item.status !== filter.status) return false;
    if (filter.rating && String(item.rating) !== filter.rating) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        (item.author || "").toLowerCase().includes(q) ||
        item.genres?.some((g) => g.toLowerCase().includes(q))
      );
    }
    return true;
  });

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Checking authentication...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 font-sans">
      {/* NAVBAR */}
      <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-lg font-bold text-purple-600">📑 Manhwee</h1>
        <div className="flex items-center gap-3 text-sm font-medium">
          <button
            onClick={() => navigate("/app")}
            className="px-3 py-1 rounded-md bg-purple-500 text-white hover:bg-purple-600"
          >
            <Home size={16} /> Dashboard
          </button>
          <button
            onClick={() => navigate("/stats")}
            className="px-3 py-1 rounded-md bg-green-500 text-white hover:bg-green-600"
          >
            <BarChart2 size={16} /> Statistic
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="px-3 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600"
          >
            <User size={16} /> Profile
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Toolbar */}
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">My Collection</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-2 py-1 border rounded-md text-sm"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 py-1 border rounded-md text-sm"
            >
              <option value="recent">Recently Added</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>
            <button
              onClick={() => navigate("/new")}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus size={16} /> New
            </button>
          </div>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-6">
          {filteredItems.length === 0 ? (
            <p className="text-gray-500 w-full text-center mt-4">
              No manhwa found.
            </p>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow overflow-hidden cursor-pointer hover:shadow-md transition"
                onClick={() => setActiveItem(item)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({
                    visible: true,
                    x: e.pageX,
                    y: e.pageY,
                    item,
                  });
                }}
              >
                <div className="w-full aspect-square overflow-hidden">
                  <img
                    src={
                      item.cover ||
                      "https://via.placeholder.com/256?text=No+Image"
                    }
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-1">
                  <h2 className="font-semibold text-lg truncate">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-500 truncate">
                    {item.author || "Unknown Author"}
                  </p>
                  <p className="text-sm text-gray-500">{item.status}</p>
                  {item.rating && (
                    <p className="text-yellow-500">
                      {"⭐".repeat(item.rating)}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu.visible && contextMenu.item && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ top: contextMenu.y, left: contextMenu.x }}
            className="fixed bg-white shadow-md rounded-md border p-2 z-50 w-32"
          >
            <button
              className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
              onClick={() => handleEdit(contextMenu.item!)}
            >
              Edit
            </button>
            <button
              className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-red-500"
              onClick={() => handleDelete(contextMenu.item!.id)}
            >
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <DetailModal item={activeItem} onClose={() => setActiveItem(null)} />
    </main>
  );
}