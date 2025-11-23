import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Stats from "./components/Stats";
import LinkForm from "./components/LinkForm";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-45">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<LinkForm />} />

          {/* Correct dynamic stats route */}
          <Route path="/stats/:code" element={<Stats />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
