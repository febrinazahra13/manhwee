import { useState } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, Link } from "react-router-dom";

export default function Landing() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Ambil semua user dari localStorage
    const users = JSON.parse(localStorage.getItem("manhwee:users") || "[]");

    // Cari user yang cocok
    const user = users.find(
      (u: any) =>
        (u.email === emailOrUsername || u.username === emailOrUsername) &&
        u.password === password
    );

    if (user) {
      // Simpan "session"
      localStorage.setItem("manhwee:token", "dummy-session-token");
      localStorage.setItem("manhwee:currentUser", JSON.stringify(user));

      alert(`Welcome back, ${user.username}!`);
      navigate("/app"); // redirect ke dashboard
    } else {
      alert("Invalid credentials ❌");
    }
  };

  const handleGoogleLogin = () => {
    alert("Google login not implemented yet 🚀");
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

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-neutral-700 rounded-full py-3 text-white hover:bg-neutral-800 transition"
        >
          <FcGoogle size={22} />
          Continue with Google
        </button>

        <div className="flex items-center gap-2 text-neutral-500 text-sm">
          <div className="flex-1 h-px bg-neutral-700" />
          <span>or</span>
          <div className="flex-1 h-px bg-neutral-700" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-left">
            <label className="block text-sm text-white mb-1">
              Email or username
            </label>
            <input
              type="text"
              placeholder="Email or username"
              className="w-full bg-neutral-800 border border-neutral-700 text-white p-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
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
            className="w-full mt-6 bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400 transition"
          >
            Log In
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