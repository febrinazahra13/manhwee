import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
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
  const [toast, setToast] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Realtime load manhwas
  useEffect(() => {
    let unsubscribeAuth: any;
    let unsubscribeData: any;

    unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
        return;
      }

      setLoading(false);

      const q = query(collection(db, "manhwee"), where("uid", "==", user.uid));
      unsubscribeData = onSnapshot(
        q,
        (snapshot) => {
          const manhwas = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as Manhwa[];
          setItems(manhwas);
        },
        (err) => console.error("Error loading manhwas:", err)
      );
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeData) unsubscribeData();
    };
  }, [navigate]);

  // Close context menu on outside click
  useEffect(() => {
    const handleClick = () =>
      setContextMenu((prev) => ({ ...prev, visible: false }));
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleDelete = async (id?: string) => {
    if (!id) {
      alert("Invalid item ID!");
      return;
    }
    if (confirm("Are you sure you want to delete this manhwa?")) {
      try {
        await deleteDoc(doc(db, "manhwee", id));
        showToast("Deleted!");
      } catch (err) {
        console.error("Error deleting manhwa:", err);
        alert("Failed to delete. Check console for details.");
      }
      setContextMenu((prev) => ({ ...prev, visible: false }));
    }
  };

  const handleEdit = (item: Manhwa) => {
    navigate("/new", { state: { editItem: item } });
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  // Sorting + Filtering + Search
  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === "title-asc") return a.title.localeCompare(b.title);
    if (sortBy === "title-desc") return b.title.localeCompare(a.title);
    return b.id.localeCompare(a.id);
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

  const NAV_STYLES: Record<string, { base: string; active: string }> = {
    "/app": { base: "bg-purple-500 text-white hover:bg-purple-600", active: "bg-purple-700 text-white font-bold ring-2 ring-purple-900" },
    "/stats": { base: "bg-green-500 text-white hover:bg-green-600", active: "bg-green-700 text-white font-bold ring-2 ring-green-900" },
    "/profile": { base: "bg-yellow-500 text-white hover:bg-yellow-600", active: "bg-yellow-700 text-white font-bold ring-2 ring-yellow-900" },
    logout: { base: "bg-red-600 text-white hover:bg-red-700", active: "bg-red-700 text-white font-bold ring-2 ring-red-900" },
  };

  if (loading) return <main className="min-h-screen flex items-center justify-center text-gray-500">Checking authentication...</main>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 font-sans relative">
      {/* Toast */}
      {toast && <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded shadow">{toast}</div>}

      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-lg font-bold text-purple-600">📑 Manhwee</h1>
        <div className="flex items-center gap-3 text-sm font-medium">
          <button onClick={() => navigate("/app")} className={`flex items-center gap-1 px-3 py-1 rounded-md shadow transition ${location.pathname === "/app" ? NAV_STYLES["/app"].active : NAV_STYLES["/app"].base}`}><Home size={16} /> Dashboard</button>
          <button onClick={() => navigate("/stats")} className={`flex items-center gap-1 px-3 py-1 rounded-md shadow transition ${location.pathname === "/stats" ? NAV_STYLES["/stats"].active : NAV_STYLES["/stats"].base}`}><BarChart2 size={16} /> Statistics</button>
          <button onClick={() => navigate("/profile")} className={`flex items-center gap-1 px-3 py-1 rounded-md shadow transition ${location.pathname === "/profile" ? NAV_STYLES["/profile"].active : NAV_STYLES["/profile"].base}`}><User size={16} /> Profile</button>
          <button onClick={handleLogout} className={`flex items-center gap-1 px-3 py-1 rounded-md shadow transition ${NAV_STYLES.logout.base}`}><LogOut size={16} /> Logout</button>
        </div>
      </nav>

      {/* Toolbar + Grid */}
      <section className="max-w-7xl mx-auto p-6 space-y-6">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">My Collection</h2>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="px-2 py-1 border rounded-md text-sm" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-2 py-1 border rounded-md text-sm">
              <option value="recent">Recently Added</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>
            <select value={filter.type} onChange={(e) => setFilter(f => ({ ...f, type: e.target.value }))} className="px-2 py-1 border rounded-md text-sm">
              <option value="">All Types</option>
              <option value="Shoujo (G)">Shoujo (G)</option>
              <option value="Shounen (B)">Shounen (B)</option>
              <option value="Josei (W)">Josei (W)</option>
              <option value="Seinen (M)">Seinen (M)</option>
              <option value="Yuri (GL)">Yuri (GL)</option>
              <option value="Yaoi (BL)">Yaoi (BL)</option>
            </select>
            <select value={filter.status} onChange={(e) => setFilter(f => ({ ...f, status: e.target.value }))} className="px-2 py-1 border rounded-md text-sm">
              <option value="">All Status</option>
              <option value="Not Started">Not Started</option>
              <option value="Reading">Reading</option>
              <option value="Completed">Completed</option>
              <option value="Dropped">Dropped</option>
            </select>
            <select value={filter.rating} onChange={(e) => setFilter(f => ({ ...f, rating: e.target.value }))} className="px-2 py-1 border rounded-md text-sm">
              <option value="">All Ratings</option>
              {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} ⭐</option>)}
            </select>
            <button onClick={() => navigate("/new")} className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"><Plus size={16} /> New</button>
          </div>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-6">
          {filteredItems.length === 0 ? (
            <p className="text-gray-500 w-full text-center mt-4">No manhwa found.</p>
          ) : (
            filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow overflow-hidden cursor-pointer hover:shadow-md transition"
                onClick={() => setActiveItem(item)}
                onContextMenu={(e) => {
                  e.preventDefault(); e.stopPropagation();
                  setContextMenu({ visible:true, x: Math.min(e.pageX, window.innerWidth-140), y: Math.min(e.pageY, window.innerHeight-60), item });
                }}>
                <div className="w-full aspect-square overflow-hidden">
                  <img src={item.cover||"https://via.placeholder.com/256?text=No+Image"} alt={item.title} className="w-full h-full object-cover" onError={(e)=>{(e.target as HTMLImageElement).src="https://via.placeholder.com/256?text=No+Image"}} />
                </div>
                <div className="p-4 space-y-1">
                  <h2 className="font-semibold text-lg truncate">{item.title}</h2>
                  <p className="text-sm text-gray-500 truncate">{item.author||"Unknown Author"}</p>
                  {item.type && <p className="text-sm text-gray-500 truncate">{item.type}</p>}
                  <p className="text-sm text-gray-500 truncate">{item.status}</p>
                  {item.rating && <p className="text-yellow-500">{"⭐".repeat(item.rating)}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu.visible && contextMenu.item && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{top:contextMenu.y,left:contextMenu.x}}
            className="fixed bg-white shadow-md rounded-md border p-2 z-50 w-32">
            <button className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded" onClick={()=>handleEdit(contextMenu.item!)}>Edit</button>
            <button className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-red-500" onClick={()=>handleDelete(contextMenu.item!.id)}>Delete</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <DetailModal item={activeItem} onClose={()=>setActiveItem(null)} />
    </main>
  );
}