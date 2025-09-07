import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      // Create a new user with Firebase
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
      navigate("/app"); // Go to dashboard
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <motion.section
        className="bg-neutral-900 p-10 rounded-2xl shadow-lg w-[400px] space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-white text-2xl font-bold text-center">
          Create your Manhwee account
        </h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="text-left">
            <label className="text-sm text-white">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full mt-1 bg-neutral-800 border border-neutral-700 text-white p-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="text-left">
            <label className="text-sm text-white">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="w-full mt-1 bg-neutral-800 border border-neutral-700 text-white p-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-left">
            <label className="text-sm text-white">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full mt-1 bg-neutral-800 border border-neutral-700 text-white p-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-neutral-400 text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-white font-medium hover:underline">
            Log in
          </Link>
        </p>
      </motion.section>
    </main>
  );
}