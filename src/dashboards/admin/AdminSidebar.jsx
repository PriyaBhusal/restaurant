import React from "react";
import "./admin.css";

const menuItems = [
  {
    title: "Dashboard",
    key: "dashboard",
    icon: "📊",
  },
  {
    title: "Dishes",
    key: "dishes",
    icon: "🍽️",
  },
  {
    title: "Users",
    key: "users",
    icon: "👥",
  },
  {
    title: "Orders",
    key: "orders",
    icon: "📋",
  },
];

export function AdminSidebar({ activeSection, setActiveSection, onLogout }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">🍽️ Restaurant Admin</h1>
      </div>
      <div className="sidebar-content">
        <div className="sidebar-group">
          <div className="sidebar-group-label">Navigation</div>
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.key} className="sidebar-menu-item">
                <button
                  onClick={() => setActiveSection(item.key)}
                  className={`sidebar-menu-button ${
                    activeSection === item.key ? "active" : ""
                  }`}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-title">{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-group logout-section">
          <button onClick={onLogout} className="logout-button">
            🔒 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
