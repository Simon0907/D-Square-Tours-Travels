import { useState } from "react";
import "../css/Admin.css";
import { Menu, X, LogOut, BarChart3, Calendar, Package, Users } from "lucide-react";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");

  const logout = () => {
    localStorage.removeItem("adminAuth");
    alert("Logged out successfully");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "packages", label: "Packages", icon: Package },
    { id: "customers", label: "Customers", icon: Users },
  ];

  const dashboardCards = [
    { label: "Total Bookings", value: "245", icon: Calendar, color: "gradient-blue" },
    { label: "Packages", value: "12", icon: Package, color: "gradient-purple" },
    { label: "Revenue", value: "₹4.5L", icon: BarChart3, color: "gradient-green" },
  ];

  return (
    <div className="admin-layout">
      <button
        className="mobile-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">D</div>
            <span>D SQUARE Admin</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeNav === item.id ? "active" : ""}`}
                onClick={() => {
                  setActiveNav(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button className="nav-item logout-btn" onClick={logout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="header-content">
            <h1>Dashboard</h1>
            <p className="header-subtitle">Welcome back! Here's your overview</p>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <input type="text" placeholder="Search..." />
              <span className="search-icon">🔍</span>
            </div>
          </div>
        </header>

        <section className="admin-cards-container">
          <div className="cards-grid">
            {dashboardCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  className={`admin-card ${card.color}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-header">
                    <div className="card-icon">
                      <Icon size={24} />
                    </div>
                    <p className="card-label">{card.label}</p>
                  </div>
                  <div className="card-value">{card.value}</div>
                  <div className="card-glow"></div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="recent-section">
          <h2>Recent Activity</h2>
          <div className="activity-card">
            <div className="activity-item">
              <div className="activity-dot"></div>
              <div className="activity-content">
                <p className="activity-title">New booking received</p>
                <p className="activity-time">2 hours ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot"></div>
              <div className="activity-content">
                <p className="activity-title">Payment processed</p>
                <p className="activity-time">4 hours ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot"></div>
              <div className="activity-content">
                <p className="activity-title">New customer registered</p>
                <p className="activity-time">6 hours ago</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
