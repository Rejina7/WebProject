import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/admin-sidebar-dark.css";

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: "home",
      label: "Home",
      icon: "🏠",
      path: "/admin/home",
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "📊",
      path: "/admin/dashboard",
    },
    {
      id: "quizzes",
      label: "Manage Quizzes",
      icon: "📝",
      path: "/admin/quizzes",
    },
    {
      id: "statistics",
      label: "Quiz Statistics",
      icon: "📈",
      path: "/admin/statistics",
    },
    {
      id: "users",
      label: "User Performance",
      icon: "👥",
      path: "/admin/users",
    },
    {
      id: "reports",
      label: "Reports",
      icon: "📋",
      path: "/admin/reports",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <>
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isOpen ? "open" : "closed"}`}>
        {/* Logo Section */}
        <div className="sidebar-header">
          <div className="logo-section">
            {isOpen && <h2>QuizzyBee</h2>}
            <span className="admin-badge">Admin</span>
          </div>
          <button
            className="toggle-btn"
            onClick={() => setIsOpen(!isOpen)}
            title={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isOpen ? "◀" : "▶"}
          </button>
        </div>

        {/* Menu */}
        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => handleMenuClick(item.path)}
              title={item.label}
            >
              <span className="menu-icon">{item.icon}</span>
              {isOpen && <span className="menu-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Settings & Logout */}
        <div className="sidebar-footer">
          <button className="sidebar-btn settings-btn" title="Settings">
            <span className="menu-icon">⚙️</span>
            {isOpen && <span>Settings</span>}
          </button>
          <button
            className="sidebar-btn logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <span className="menu-icon">🚪</span>
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Toggle button for mobile */}
      {!isOpen && (
        <button
          className="mobile-toggle-btn"
          onClick={() => setIsOpen(true)}
          title="Open menu"
        >
          ☰
        </button>
      )}
    </>
  );
}

export default AdminSidebar;
