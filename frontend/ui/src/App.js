import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Errors from "./pages/Errors";
import ErrorDetail from "./pages/ErrorDetail";
import Modules from "./pages/Modules";

export default function App() {
  return (
    <BrowserRouter>
      {/* Simple nav so you can test */}
      <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: 10 }}>Dashboard</Link>
        <Link to="/errors" style={{ marginRight: 10 }}>Errors</Link>
        <Link to="/modules">Modules</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/errors" element={<Errors />} />
        <Route path="/errors/:id" element={<ErrorDetail />} />
        <Route path="/modules" element={<Modules />} />
      </Routes>
    </BrowserRouter>
  );
}
