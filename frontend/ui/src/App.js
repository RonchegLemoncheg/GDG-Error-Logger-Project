import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Errors from "./pages/Errors";
import Modules from "./pages/Modules";
import logo from "./logo.png";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="navbar-brand">
          <img src={logo} alt="BugLens Logo" className="logo-image" />
          <span className="brand-text">BugLens</span>
        </div>
        
        <div className="navbar-links">
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/errors"
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            <span className="nav-icon">🐛</span>
            <span>Errors</span>
          </NavLink>
          
          <NavLink 
            to="/modules"
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            <span className="nav-icon">📦</span>
            <span>Modules</span>
          </NavLink>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/errors" element={<Errors />} />
        <Route path="/modules" element={<Modules />} />
      </Routes>
    </BrowserRouter>
  );
}