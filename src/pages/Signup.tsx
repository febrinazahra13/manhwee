import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("manhwee:users") || "[]");

    // Check if user exists
    if (users.find((u: any) => u.email === email || u.username === username)) {
      alert("User already exists!");
      return;
    }

    // Add new user
    const newUser = { username, email, password };
    users.push(newUser);
    localStorage.setItem("manhwee:users", JSON.stringify(users));

    alert("Account created successfully! Please log in.");
    navigate("/"); // back to login (Landing page)
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
            <label className="text-sm text-white">Username</label>
            <input
              type="text"
              placeholder="Username"
              className="w-full mt-1 bg-neutral-800 border border-neutral-700 text-white p-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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
            className="w-full mt-6 bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400 transition"
          >
            Sign Up
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