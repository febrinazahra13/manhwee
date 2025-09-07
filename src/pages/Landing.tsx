import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Landing() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/app");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-4">
      <motion.section
        className="bg-neutral-900 p-8 rounded-2xl shadow-lg w-[360px] space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-white text-2xl font-bold text-center">
          Welcome to Manhwee
        </h1>
        <p className="text-neutral-400 text-center text-sm">
          Track your manhwa reading journey with style ✨
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-left">
            <label className="block text-sm text-white mb-1">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-neutral-800 border border-neutral-700 text-white p-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="text-left">
            <label className="block text-sm text-white mb-1">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-neutral-800 border border-neutral-700 text-white p-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-neutral-400 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-green-400 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </motion.section>
    </main>
  );
}