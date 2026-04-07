import { useState, useEffect } from "react";
import "../css/Admin.css";
import {
  Menu, X, LogOut, BarChart3, Calendar, Package,
  Users, Car, CheckCircle, XCircle, Trash2, Clock, Star, FileText
} from "lucide-react";

// ─── API BASE ─────────────────────────────────────────────────────────────────
const BASE = "https://d-square-tours-travels.onrender.com/api";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav,   setActiveNav]   = useState("dashboard");

  const [stats,             setStats]             = useState(null);

  const [famousBookings,    setFamousBookings]    = useState([]);
  const [packageEnquiries,  setPackageEnquiries]  = useState([]);
  const [vehicleBookings,   setVehicleBookings]   = useState([]);
  const [customers,         setCustomers]         = useState([]);
  const [packages,          setPackages]          = useState([]);
  const [vehiclesList,      setVehiclesList]      = useState([]);
  const [activity,          setActivity]          = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [error,             setError]             = useState("");

  // ── Fetch all data on mount ────────────────────────────────────────────────
  useEffect(() => {
    fetchAll();
  }, []);

  // ── Fetch everything from real backend ────────────────────────────────────
  /**
   * API Endpoints used:
   * GET /api/admin/stats
   * GET /api/admin/bookings           → tour bookings
   * GET /api/admin/famous-bookings    → famous package bookings
   * GET /api/admin/package-enquiries  → package enquiries
   * GET /api/admin/vehicle-bookings   → vehicle bookings
   * GET /api/admin/customers
   */
  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [sRes, tbRes, fbRes, peRes, vbRes, cRes] = await Promise.all([
        fetch(`${BASE}/admin/stats`,              { headers: authHeaders() }),
        fetch(`${BASE}/admin/bookings`,           { headers: authHeaders() }),
        fetch(`${BASE}/admin/famous-bookings`,    { headers: authHeaders() }),
        fetch(`${BASE}/admin/package-enquiries`,  { headers: authHeaders() }),
        fetch(`${BASE}/admin/vehicle-bookings`,   { headers: authHeaders() }),
        fetch(`${BASE}/admin/customers`,          { headers: authHeaders() }),
      ]);

      if (!sRes.ok)  throw new Error("Failed to fetch stats");
      if (!tbRes.ok) throw new Error("Failed to fetch bookings");

      const [s, tb, fb, pe, vb, c] = await Promise.all([
        sRes.json(), tbRes.json(), fbRes.json(),
        peRes.json(), vbRes.json(), cRes.json(),
      ]);

      setStats(s);
    
      setFamousBookings(Array.isArray(fb) ? fb : []);
      setPackageEnquiries(Array.isArray(pe) ? pe : []);
      setVehicleBookings(Array.isArray(vb) ? vb : []);
      setCustomers(Array.isArray(c) ? c : []);

      // Activity feed from recent bookings
      const recent = [...(Array.isArray(tb)?tb:[]), ...(Array.isArray(fb)?fb:[]), ...(Array.isArray(vb)?vb:[])]
        .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map((b, i) => ({
          id: i,
          text: `New ${b.type || "booking"} — ${b.customer}`,
          time: timeAgo(b.createdAt),
          type: "booking",
        }));
      setActivity(recent);

    } catch (e) {
      console.error("Fetch error:", e);
      setError(e.message || "Failed to load data. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  // ── Update booking status ──────────────────────────────────────────────────
  /**
   * PATCH /api/admin/bookings/:id/status
   * Body: { status: "confirmed" | "cancelled" }
   */
  const updateStatus = async (id, status, setter) => {
    try {
      const res = await fetch(`${BASE}/admin/bookings/${id}/status`, {
        method:  "PATCH",
        headers: authHeaders(),
        body:    JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setter((prev) => prev.map((b) =>
        (b._id === id || b.id === id) ? { ...b, status } : b
      ));
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  // ── Delete booking ─────────────────────────────────────────────────────────
  /**
   * DELETE /api/admin/bookings/:id
   */
  const deleteEntry = async (id, setter) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      const res = await fetch(`${BASE}/admin/bookings/${id}`, {
        method:  "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete");
      setter((prev) => prev.filter((b) => b._id !== id && b.id !== id));
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  // ── Delete customer ────────────────────────────────────────────────────────
  /**
   * DELETE /api/admin/customers/:id
   */
  const deleteCustomer = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      const res = await fetch(`${BASE}/admin/customers/${id}`, {
        method:  "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete customer");
      setCustomers((prev) => prev.filter((c) => c._id !== id));
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth";
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const statusClass = (s = "") => {
    switch (s.toLowerCase()) {
      case "confirmed": case "active": case "available": return "badge-green";
      case "pending":                                     return "badge-yellow";
      case "cancelled": case "inactive": case "booked":  return "badge-red";
      default: return "badge-grey";
    }
  };

  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric",
        })
      : "—";

  const fmtTime = (d) =>
    d ? new Date(d).toLocaleString("en-IN", {
          day: "numeric", month: "short",
          hour: "2-digit", minute: "2-digit",
        })
      : "—";

  const timeAgo = (d) => {
    if (!d) return "—";
    const diff = Math.floor((Date.now() - new Date(d)) / 60000);
    if (diff < 1)   return "just now";
    if (diff < 60)  return `${diff} min ago`;
    if (diff < 1440)return `${Math.floor(diff/60)} hours ago`;
    return `${Math.floor(diff/1440)} days ago`;
  };

  const actIcon = (t) =>
    ({ booking:"📅", payment:"💰", customer:"👤", package:"🗺", cancel:"❌" }[t] || "🔔");

  // ── Computed stats ─────────────────────────────────────────────────────────
  const allBookings    = [...famousBookings, ...vehicleBookings,...packageEnquiries];
  const pendingCount   = allBookings.filter((b) => b.status === "pending").length;
  const confirmedCount = allBookings.filter((b) => b.status === "confirmed").length;

  // ── Action buttons component ───────────────────────────────────────────────
  const ActionBtns = ({ b, setter }) => (
    <div className="action-btns">
      {b.status === "pending" && (
        <>
          <button className="act-btn act-confirm" title="Confirm"
            onClick={() => updateStatus(b._id || b.id, "confirmed", setter)}>
            <CheckCircle size={14} />
          </button>
          <button className="act-btn act-cancel" title="Cancel"
            onClick={() => updateStatus(b._id || b.id, "cancelled", setter)}>
            <XCircle size={14} />
          </button>
        </>
      )}
      <button className="act-btn act-delete" title="Delete"
        onClick={() => deleteEntry(b._id || b.id, setter)}>
        <Trash2 size={14} />
      </button>
    </div>
  );

  const menuItems = [
    { id: "dashboard",        label: "Dashboard",         icon: BarChart3, count: null },

    { id: "famousBookings",   label: "Famous Bookings",   icon: Star,      count: famousBookings.length },
    { id: "packageEnquiries", label: "Package Enquiries", icon: FileText,  count: packageEnquiries.filter(e => e.status === "pending").length },
    { id: "vehicleBookings",  label: "Vehicle Bookings",  icon: Car,       count: vehicleBookings.length },
    { id: "customers",        label: "Customers",         icon: Users,     count: null },
  ];

  return (
    <div className="admin-layout">
      <button className="mobile-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* ── SIDEBAR ── */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">D</div>
            <span>D SQUARE Admin</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map(({ id, label, icon: Icon, count }) => (
            <button key={id}
              className={`nav-item ${activeNav === id ? "active" : ""}`}
              onClick={() => { setActiveNav(id); if (window.innerWidth < 768) setSidebarOpen(false); }}>
              <Icon size={18} />
              <span>{label}</span>
              {count > 0 && <span className="nav-badge">{count}</span>}
            </button>
          ))}
        </nav>
        <button className="nav-item logout-btn" onClick={logout}>
          <LogOut size={18} /><span>Logout</span>
        </button>
      </aside>

      {/* ── MAIN ── */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-content">
            <h1>{menuItems.find((m) => m.id === activeNav)?.label || "Dashboard"}</h1>
          </div>
          <div className="header-actions">
            <button className="refresh-btn" onClick={fetchAll} title="Refresh data">
              🔄 Refresh
            </button>
            <div className="search-box">
              <input type="text" placeholder="Search..." />
              <span className="search-icon">🔍</span>
            </div>
          </div>
        </header>

        {/* Loading */}
        {loading && (
          <div className="admin-loading">
            <div className="admin-spinner" />
            <p>Loading data from server...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="admin-error" style={{ margin: "2rem" }}>
            ⚠ {error}
            <button onClick={fetchAll}
              style={{ marginLeft:"1rem", padding:"0.3rem 0.8rem",
                       background:"var(--orange)", color:"#fff",
                       border:"none", borderRadius:"6px", cursor:"pointer" }}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="admin-content">

            {/* ══ DASHBOARD ══ */}
            {activeNav === "dashboard" && (
              <>
                <div className="cards-grid">
                  {[

                    { label: "Famous Bookings",   value: famousBookings.length,   icon: Star,       color: "orange" },
                    { label: "Package Enquiries", value: packageEnquiries.length, icon: FileText,   color: "purple" },
                    { label: "Vehicle Bookings",  value: vehicleBookings.length,  icon: Car,        color: "teal"   },
                    { label: "Pending Actions",   value: pendingCount,            icon: Clock,      color: "yellow" },
                    { label: "Confirmed",         value: confirmedCount,          icon: CheckCircle,color: "green"  },
                  ].map(({ label, value, icon: Icon, color }, i) => (
                    <div className={`admin-card card-${color}`} key={i}
                      style={{ animationDelay:`${i*0.07}s` }}>
                      <div className="card-header">
                        <div className="card-icon"><Icon size={20} /></div>
                        <p className="card-label">{label}</p>
                      </div>
                      <div className="card-value">{value}</div>
                    </div>
                  ))}
                </div>

                {/* Recent bookings preview */}
                {[
                  { title: "⭐ Famous Package Bookings", data: famousBookings.slice(0,3),
                    cols: ["Customer","Travel Date","Time","Vehicle","Amount","Status"],
                    row: (b) => [
                      <><strong>{b.customer}</strong><br/><small style={{color:"#888"}}>{b.phone}</small></>,
                      <strong style={{color:"#ff6b00"}}>{fmt(b.travelDate)}</strong>,
                      b.travelTime || "—", b.vehicle,
                      `₹${Number(b.amount||0).toLocaleString()}`,
                      <span className={`status-badge ${statusClass(b.status)}`}>{b.status}</span>
                    ]
                  },
                
                  { title: "🚗 Vehicle Bookings", data: vehicleBookings.slice(0,3),
                    cols: ["Customer","Vehicle","Travel Date","Time","Trip","Status"],
                    row: (b) => [
                      <><strong>{b.customer}</strong><br/><small style={{color:"#888"}}>{b.phone}</small></>,
                      b.vehicleName,
                      <strong style={{color:"#ff6b00"}}>{fmt(b.travelDate)}</strong>,
                      b.travelTime || "—", b.tripType || "—",
                      <span className={`status-badge ${statusClass(b.status)}`}>{b.status}</span>
                    ]
                  },
                ].map(({ title, data, cols, row }, si) => (
                  <div className="section-box" key={si}>
                    <h2 className="section-title">{title}</h2>
                    <div className="table-wrap">
                      <table className="admin-table">
                        <thead><tr>{cols.map((c,i) => <th key={i}>{c}</th>)}</tr></thead>
                        <tbody>
                          {data.map((b, i) => (
                            <tr key={b._id || i}>{row(b).map((cell,j) => <td key={j}>{cell}</td>)}</tr>
                          ))}
                          {data.length === 0 && (
                            <tr><td colSpan={cols.length}
                              style={{textAlign:"center",padding:"1.5rem",color:"#aaa"}}>
                              No entries yet
                            </td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}

                {/* Activity feed */}
                {activity.length > 0 && (
                  <div className="section-box">
                    <h2 className="section-title">Recent Activity</h2>
                    <div className="activity-list">
                      {activity.map((a) => (
                        <div className="activity-item" key={a.id}>
                          <span className="activity-emoji">{actIcon(a.type)}</span>
                          <div className="activity-content">
                            <p className="activity-title">{a.text}</p>
                            <p className="activity-time">{a.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            

            {/* ══ FAMOUS BOOKINGS ══ */}
            {activeNav === "famousBookings" && (
              <div className="section-box">
                <div className="famous-header-bar">
                  <h2 className="section-title">
                    ⭐ Famous Package Bookings
                    <span className="count-pill famous-pill">{famousBookings.length}</span>
                  </h2>
                  <p className="famous-route-note">
                    Madurai → Rameswaram → Kanyakumari → Thiruvananthapuram (5 Days)
                  </p>
                </div>
                <div className="table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr><th>ID</th><th>Customer</th><th>Travel Date</th><th>Pickup Time</th>
                        <th>Return Date</th><th>Vehicle</th><th>Persons</th>
                        <th>Pickup</th><th>Amount</th><th>Booked At</th><th>Status</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {famousBookings.map((b) => (
                        <tr key={b._id}>
                          <td className="muted-cell" style={{fontSize:"0.7rem"}}>{b.bookingId || b._id?.slice(-6)}</td>
                          <td><strong>{b.customer}</strong><br/><small style={{color:"#888"}}>{b.phone}</small></td>
                          <td><strong style={{color:"#ff6b00"}}>{fmt(b.travelDate)}</strong></td>
                          <td><strong>{b.travelTime || "—"}</strong></td>
                          <td>{fmt(b.returnDate)}</td>
                          <td>{b.vehicle}</td>
                          <td style={{textAlign:"center"}}>{b.numberOfPersons}</td>
                          <td>{b.pickupLocation}</td>
                          <td className="amount-cell">₹{Number(b.amount||0).toLocaleString()}</td>
                          <td style={{fontSize:"0.76rem",color:"#888",whiteSpace:"nowrap"}}>{fmtTime(b.createdAt)}</td>
                          <td><span className={`status-badge ${statusClass(b.status)}`}>{b.status}</span></td>
                          <td><ActionBtns b={b} setter={setFamousBookings} /></td>
                        </tr>
                      ))}
                      {famousBookings.length === 0 && (
                        <tr><td colSpan={12} style={{textAlign:"center",padding:"3rem",color:"#aaa"}}>No famous bookings yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══ PACKAGE ENQUIRIES ══ */}
            {activeNav === "packageEnquiries" && (
              <div className="section-box">
                <h2 className="section-title">
                  📋 Package Enquiries
                  <span className="count-pill">{packageEnquiries.length}</span>
                </h2>
                <div className="table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr><th>ID</th><th>Customer</th><th>Package</th><th>Travel Date</th>
                        <th>Time</th><th>Return</th><th>Persons</th><th>Pickup</th>
                        <th>Enquired At</th><th>Status</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packageEnquiries.map((b) => (
                        <tr key={b._id}>
                          <td className="muted-cell" style={{fontSize:"0.7rem"}}>{b.enquiryId || b._id?.slice(-6)}</td>
                          <td><strong>{b.customer}</strong><br/><small style={{color:"#888"}}>{b.phone}</small></td>
                          <td>{b.packageTitle}</td>
                          <td><strong style={{color:"#ff6b00"}}>{fmt(b.travelDate)}</strong></td>
                          <td><strong>{b.travelTime || "—"}</strong></td>
                          <td>{fmt(b.returnDate)}</td>
                          <td style={{textAlign:"center"}}>{b.numberOfPersons}</td>
                          <td>{b.pickupLocation}</td>
                          <td style={{fontSize:"0.76rem",color:"#888",whiteSpace:"nowrap"}}>{fmtTime(b.createdAt)}</td>
                          <td><span className={`status-badge ${statusClass(b.status)}`}>{b.status}</span></td>
                          <td><ActionBtns b={b} setter={setPackageEnquiries} /></td>
                        </tr>
                      ))}
                      {packageEnquiries.length === 0 && (
                        <tr><td colSpan={11} style={{textAlign:"center",padding:"3rem",color:"#aaa"}}>No enquiries yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══ VEHICLE BOOKINGS ══ */}
            {activeNav === "vehicleBookings" && (
              <div className="section-box">
                <h2 className="section-title">
                  🚗 Vehicle Bookings
                  <span className="count-pill">{vehicleBookings.length}</span>
                </h2>
                <div className="table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr><th>ID</th><th>Customer</th><th>Vehicle</th><th>Trip Type</th>
                        <th>Travel Date</th><th>Time</th><th>Return</th>
                        <th>Persons</th><th>Pickup</th><th>Drop</th>
                        <th>Rent/Day</th><th>Booked At</th><th>Status</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicleBookings.map((b) => (
                        <tr key={b._id}>
                          <td className="muted-cell" style={{fontSize:"0.7rem"}}>{b.bookingId || b._id?.slice(-6)}</td>
                          <td><strong>{b.customer}</strong><br/><small style={{color:"#888"}}>{b.phone}</small></td>
                          <td><strong>{b.vehicleName}</strong></td>
                          <td><span className={`type-pill ${b.tripType==="Round Trip"?"type-pkg":"type-veh"}`}>{b.tripType}</span></td>
                          <td><strong style={{color:"#ff6b00"}}>{fmt(b.travelDate)}</strong></td>
                          <td><strong>{b.travelTime || "—"}</strong></td>
                          <td>{b.returnDate ? fmt(b.returnDate) : "—"}</td>
                          <td style={{textAlign:"center"}}>{b.numberOfPersons}</td>
                          <td>{b.pickupLocation}</td>
                          <td>{b.dropLocation || "—"}</td>
                          <td className="amount-cell" style={{fontSize:"0.82rem"}}>{b.rentPerDay || "—"}</td>
                          <td style={{fontSize:"0.76rem",color:"#888",whiteSpace:"nowrap"}}>{fmtTime(b.createdAt)}</td>
                          <td><span className={`status-badge ${statusClass(b.status)}`}>{b.status}</span></td>
                          <td><ActionBtns b={b} setter={setVehicleBookings} /></td>
                        </tr>
                      ))}
                      {vehicleBookings.length === 0 && (
                        <tr><td colSpan={14} style={{textAlign:"center",padding:"3rem",color:"#aaa"}}>No vehicle bookings yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══ CUSTOMERS ══ */}
            {activeNav === "customers" && (
              <div className="section-box">
                <h2 className="section-title">
                  Customers
                  <span className="count-pill">{customers.length}</span>
                </h2>
                <div className="table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {customers.map((c, i) => (
                        <tr key={c._id}>
                          <td className="muted-cell">{i + 1}</td>
                          <td>
                            <div className="customer-name">
                              <div className="cust-avatar">{c.name?.charAt(0)}</div>
                              <strong>{c.name}</strong>
                            </div>
                          </td>
                          <td>{c.email}</td>
                          <td>{c.phone || "—"}</td>
                          <td>{fmt(c.createdAt)}</td>
                          <td>
                            <button className="act-btn act-delete"
                              onClick={() => deleteCustomer(c._id)}>
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {customers.length === 0 && (
                        <tr><td colSpan={6} style={{textAlign:"center",padding:"3rem",color:"#aaa"}}>No customers yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;