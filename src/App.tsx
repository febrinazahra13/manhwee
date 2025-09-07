import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/app" element={<Dashboard />} />
        {/* fallback biar ga 404 */}
        <Route path="*" element={<h1 style={{ color: "white" }}>Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}