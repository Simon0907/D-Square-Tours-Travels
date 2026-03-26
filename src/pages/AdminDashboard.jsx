import { useState, useEffect } from "react";
import "../css/Admin.css";
import {
  Menu, X, LogOut, BarChart3, Calendar, Package,
  Users, Car, CheckCircle, XCircle, Trash2, Clock, Star
} from "lucide-react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const BASE     = "http://localhost:5000/api";
const USE_MOCK = true; // ← set false when backend ready

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ─── MOCK STATIC DATA ─────────────────────────────────────────────────────────
const MOCK_CUSTOMERS = [
  { _id: "c1", name: "Arun Kumar",   email: "arun@gmail.com",   phone: "9876543210", createdAt: "2025-05-10" },
  { _id: "c2", name: "Priya Sharma", email: "priya@gmail.com",  phone: "9123456780", createdAt: "2025-05-15" },
  { _id: "c3", name: "Ravi Mohan",   email: "ravi@gmail.com",   phone: "9988776655", createdAt: "2025-06-01" },
  { _id: "c4", name: "Sneha Pillai", email: "sneha@gmail.com",  phone: "9001122334", createdAt: "2025-06-05" },
];

const MOCK_PACKAGES = [
  { _id: "p1", title: "Kerala Backwaters", destination: "Kerala",    duration: "5D/4N", price: 18500, status: "active"   },
  { _id: "p2", title: "Rajasthan Royal",   destination: "Rajasthan", duration: "7D/6N", price: 24000, status: "active"   },
  { _id: "p3", title: "Ooty Nilgiri Hills",destination: "Ooty",      duration: "3D/2N", price: 9500,  status: "active"   },
  { _id: "p4", title: "Goa Beach Fiesta",  destination: "Goa",       duration: "4D/3N", price: 14000, status: "inactive" },
];

const MOCK_VEHICLES = [
  { _id: "v1", name: "Toyota Innova Crysta",     type: "SUV",       seats: 7,  pricePerDay: 3500, status: "available" },
  { _id: "v2", name: "Tempo Traveller 12-Seater", type: "Mini Bus", seats: 12, pricePerDay: 5500, status: "available" },
  { _id: "v3", name: "Swift Dzire",              type: "Sedan",     seats: 4,  pricePerDay: 1800, status: "booked"    },
];

const MOCK_ACTIVITY = [
  { id: 1, text: "New famous package booking",   time: "1 hour ago",   type: "booking"  },
  { id: 2, text: "Package booking confirmed",    time: "3 hours ago",  type: "payment"  },
  { id: 3, text: "New customer registered",      time: "5 hours ago",  type: "customer" },
  { id: 4, text: "Tour package updated",         time: "Yesterday",    type: "package"  },
];

// Sample fallback bookings
const SAMPLE_BOOKINGS = [
  {
    id: "BK-001", customer: "Arun Kumar", email: "arun@gmail.com", phone: "9876543210",
    type: "Package", item: "Kerala Backwaters", packageTitle: "Kerala Backwaters",
    travelDate: "2025-08-15", returnDate: "2025-08-20", numberOfDays: 5,
    vehicle: "SUV (Innova)", acType: "AC", numberOfPersons: "4",
    pickupLocation: "Madurai", amount: 29700, status: "pending",
    bookedAt: new Date().toISOString(), date: "10 Jun 2025",
  },
];

const SAMPLE_FAMOUS_BOOKINGS = [
  {
    id: "FAM-001", customer: "Priya Sharma", phone: "9123456780",
    type: "Famous Package", packageTitle: "5 Days Round Trip",
    route: "Madurai → Rameswaram → Kanyakumari → Thiruvananthapuram",
    travelDate: "2025-08-20", travelTime: "06:00", returnDate: "2025-08-25",
    vehicle: "SUV (Innova)", numberOfPersons: "4",
    pickupLocation: "Chennai", amount: 24100, status: "pending",
    bookedAt: new Date().toISOString(), date: "11 Jun 2025",
  },
];

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav,   setActiveNav]   = useState("dashboard");

  const [bookings,       setBookings]       = useState([]);
  const [famousBookings, setFamousBookings] = useState([]);
  const [customers,      setCustomers]      = useState([]);
  const [packages,       setPackages]       = useState([]);
  const [vehicles,       setVehicles]       = useState([]);
  const [activity,       setActivity]       = useState([]);
  const [loading,        setLoading]        = useState(true);

  // ── Load data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadData = () => {
      // Read from localStorage (real bookings from forms)
      const storedBookings = JSON.parse(localStorage.getItem("adminBookings"))       || [];
      const storedFamous   = JSON.parse(localStorage.getItem("adminFamousBookings")) || [];

      setBookings(storedBookings.length > 0         ? storedBookings       : SAMPLE_BOOKINGS);
      setFamousBookings(storedFamous.length > 0     ? storedFamous         : SAMPLE_FAMOUS_BOOKINGS);
      setCustomers(MOCK_CUSTOMERS);
      setPackages(MOCK_PACKAGES);
      setVehicles(MOCK_VEHICLES);
      setActivity(MOCK_ACTIVITY);
      setLoading(false);
    };

    if (USE_MOCK) {
      setTimeout(loadData, 500);
    } else {
      fetchAll();
    }

    // Re-read when BookingForm saves new data
    const onStorage = () => {
      const b = JSON.parse(localStorage.getItem("adminBookings"))       || [];
      const f = JSON.parse(localStorage.getItem("adminFamousBookings")) || [];
      if (b.length > 0) setBookings(b);
      if (f.length > 0) setFamousBookings(f);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ── Real API calls ─────────────────────────────────────────────────────────
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [bRes, fRes, cRes, pRes, vRes] = await Promise.all([
        fetch(`${BASE}/admin/bookings`,        { headers: authHeaders() }),
        fetch(`${BASE}/admin/famous-bookings`, { headers: authHeaders() }),
        fetch(`${BASE}/admin/customers`,       { headers: authHeaders() }),
        fetch(`${BASE}/admin/packages`,        { headers: authHeaders() }),
        fetch(`${BASE}/admin/vehicles`,        { headers: authHeaders() }),
      ]);
      const [b, f, c, p, v] = await Promise.all([
        bRes.json(), fRes.json(), cRes.json(), pRes.json(), vRes.json()
      ]);
      setBookings(b); setFamousBookings(f);
      setCustomers(c); setPackages(p); setVehicles(v);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // ── Update status helpers ──────────────────────────────────────────────────
  const updateStatus = (id, status, isFamous = false) => {
    if (isFamous) {
      const updated = famousBookings.map((b) =>
        (b.id === id || b._id === id) ? { ...b, status } : b
      );
      setFamousBookings(updated);
      localStorage.setItem("adminFamousBookings", JSON.stringify(updated));
    } else {
      const updated = bookings.map((b) =>
        (b.id === id || b._id === id) ? { ...b, status } : b
      );
      setBookings(updated);
      localStorage.setItem("adminBookings", JSON.stringify(updated));
    }
    if (!USE_MOCK) {
      fetch(`${BASE}/admin/bookings/${id}/status`, {
        method: "PATCH", headers: authHeaders(), body: JSON.stringify({ status }),
      });
    }
  };

  const deleteBooking = (id, isFamous = false) => {
    if (!window.confirm("Delete this booking?")) return;
    if (isFamous) {
      const updated = famousBookings.filter((b) => b.id !== id && b._id !== id);
      setFamousBookings(updated);
      localStorage.setItem("adminFamousBookings", JSON.stringify(updated));
    } else {
      const updated = bookings.filter((b) => b.id !== id && b._id !== id);
      setBookings(updated);
      localStorage.setItem("adminBookings", JSON.stringify(updated));
    }
  };

  const deletePackage  = (id) => { if (window.confirm("Delete?")) setPackages((p)  => p.filter((x) => x._id !== id)); };
  const deleteVehicle  = (id) => { if (window.confirm("Delete?")) setVehicles((p)  => p.filter((x) => x._id !== id)); };
  const deleteCustomer = (id) => { if (window.confirm("Delete?")) setCustomers((p) => p.filter((x) => x._id !== id)); };

  const logout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth";
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const allBookings    = [...bookings, ...famousBookings];
  const totalRevenue   = allBookings.filter((b) => b.status === "confirmed")
                                    .reduce((s, b) => s + (b.amount || 0), 0);
  const pendingCount   = allBookings.filter((b) => b.status === "pending").length;
  const confirmedCount = allBookings.filter((b) => b.status === "confirmed").length;

  const statusClass = (s = "") => {
    switch (s.toLowerCase()) {
      case "confirmed": case "active": case "available": return "badge-green";
      case "pending":                                     return "badge-yellow";
      case "cancelled": case "inactive": case "booked":  return "badge-red";
      default: return "badge-grey";
    }
  };

  const actIcon = (t) => ({ booking:"📅", payment:"💰", customer:"👤", package:"🗺", cancel:"❌" }[t] || "🔔");
  const fmt     = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "—";
  const fmtTime = (d) => d ? new Date(d).toLocaleString("en-IN",     { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" }) : "—";

  const menuItems = [
    { id: "dashboard",     label: "Dashboard",         icon: BarChart3 },
    { id: "bookings",      label: "Tour Bookings",     icon: Calendar  },
    { id: "famousBookings",label: "Famous Bookings",   icon: Star      },
    { id: "packages",      label: "Packages",          icon: Package   },
    { id: "vehicles",      label: "Vehicles",          icon: Car       },
    { id: "customers",     label: "Customers",         icon: Users     },
  ];

  // ── Booking table (reusable for both tabs) ─────────────────────────────────
  const BookingTable = ({ data, isFamous }) => (
    <div className="table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            {isFamous ? <th>Route</th> : <th>Package</th>}
            <th>Travel Date</th>
            {isFamous && <th>Pickup Time</th>}
            <th>Return Date</th>
            <th>Vehicle</th>
            <th>Persons</th>
            <th>Pickup</th>
            <th>Amount</th>
            <th>Booked At</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((b) => (
            <tr key={b.id || b._id}>
              <td className="muted-cell" style={{ fontSize:"0.72rem" }}>{b.id || b._id}</td>
              <td>
                <strong>{b.customer}</strong><br />
                <small style={{ color:"#888" }}>{b.phone}</small>
              </td>
              <td style={{ maxWidth:180, fontSize:"0.82rem" }}>
                {isFamous ? b.route : (b.packageTitle || b.item)}
              </td>
              <td><strong style={{ color:"#ff6b00" }}>{fmt(b.travelDate)}</strong></td>
              {isFamous && <td><strong>{b.travelTime || "—"}</strong></td>}
              <td>{fmt(b.returnDate)}</td>
              <td style={{ fontSize:"0.82rem" }}>{b.vehicle || "—"}{b.acType ? ` (${b.acType})` : ""}</td>
              <td style={{ textAlign:"center" }}>{b.numberOfPersons || "—"}</td>
              <td style={{ fontSize:"0.82rem" }}>{b.pickupLocation || "—"}</td>
              <td className="amount-cell">₹{Number(b.amount || 0).toLocaleString()}</td>
              <td style={{ fontSize:"0.76rem", color:"#888", whiteSpace:"nowrap" }}>{fmtTime(b.bookedAt)}</td>
              <td><span className={`status-badge ${statusClass(b.status)}`}>{b.status}</span></td>
              <td>
                <div className="action-btns">
                  {b.status === "pending" && (
                    <>
                      <button className="act-btn act-confirm" title="Confirm"
                        onClick={() => updateStatus(b.id || b._id, "confirmed", isFamous)}>
                        <CheckCircle size={14} />
                      </button>
                      <button className="act-btn act-cancel" title="Cancel"
                        onClick={() => updateStatus(b.id || b._id, "cancelled", isFamous)}>
                        <XCircle size={14} />
                      </button>
                    </>
                  )}
                  <button className="act-btn act-delete" title="Delete"
                    onClick={() => deleteBooking(b.id || b._id, isFamous)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr><td colSpan={13} style={{ textAlign:"center", padding:"3rem", color:"#aaa" }}>
              No bookings yet
            </td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

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
          {menuItems.map(({ id, label, icon: Icon }) => (
            <button key={id}
              className={`nav-item ${activeNav === id ? "active" : ""}`}
              onClick={() => { setActiveNav(id); if (window.innerWidth < 768) setSidebarOpen(false); }}>
              <Icon size={18} />
              <span>{label}</span>
              {/* Badge for famous bookings count */}
              {id === "famousBookings" && famousBookings.length > 0 && (
                <span className="nav-badge">{famousBookings.length}</span>
              )}
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
            <h1>{menuItems.find((m) => m.id === activeNav)?.label}</h1>
            {USE_MOCK && (
              <span className="mock-badge">🟡 Mock Mode — set USE_MOCK=false when backend ready</span>
            )}
          </div>
          <div className="search-box">
            <input type="text" placeholder="Search..." />
            <span className="search-icon">🔍</span>
          </div>
        </header>

        {loading ? (
          <div className="admin-loading"><div className="admin-spinner" /><p>Loading...</p></div>
        ) : (
          <div className="admin-content">

            {/* ── DASHBOARD ── */}
            {activeNav === "dashboard" && (
              <>
                <div className="cards-grid">
                  {[
                    { label: "Tour Bookings",       value: bookings.length,        icon: Calendar,   color: "blue"   },
                    { label: "Famous Bookings",      value: famousBookings.length,  icon: Star,       color: "orange" },
                    { label: "Confirmed",            value: confirmedCount,         icon: CheckCircle,color: "green"  },
                    { label: "Pending",              value: pendingCount,           icon: Clock,      color: "yellow" },
                    { label: "Packages",             value: packages.length,        icon: Package,    color: "purple" },
                    { label: "Total Revenue",        value: `₹${totalRevenue.toLocaleString()}`, icon: BarChart3, color: "teal" },
                  ].map(({ label, value, icon: Icon, color }, i) => (
                    <div className={`admin-card card-${color}`} key={i} style={{ animationDelay:`${i*0.07}s` }}>
                      <div className="card-header">
                        <div className="card-icon"><Icon size={20} /></div>
                        <p className="card-label">{label}</p>
                      </div>
                      <div className="card-value">{value}</div>
                    </div>
                  ))}
                </div>

                {/* Famous Bookings Preview */}
                {famousBookings.length > 0 && (
                  <div className="section-box">
                    <h2 className="section-title">
                      ⭐ Recent Famous Package Bookings
                      <span className="count-pill famous-pill">{famousBookings.length}</span>
                    </h2>
                    <div className="table-wrap">
                      <table className="admin-table">
                        <thead>
                          <tr><th>Customer</th><th>Route</th><th>Travel Date</th><th>Time</th><th>Vehicle</th><th>Amount</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                          {famousBookings.slice(0, 5).map((b) => (
                            <tr key={b.id || b._id}>
                              <td><strong>{b.customer}</strong><br /><small style={{color:"#888"}}>{b.phone}</small></td>
                              <td style={{fontSize:"0.8rem",maxWidth:200}}>{b.route}</td>
                              <td><strong style={{color:"#ff6b00"}}>{fmt(b.travelDate)}</strong></td>
                              <td><strong>{b.travelTime || "—"}</strong></td>
                              <td>{b.vehicle}</td>
                              <td className="amount-cell">₹{Number(b.amount).toLocaleString()}</td>
                              <td><span className={`status-badge ${statusClass(b.status)}`}>{b.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Tour Bookings Preview */}
                <div className="section-box">
                  <h2 className="section-title">📅 Recent Tour Bookings</h2>
                  <div className="table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr><th>Customer</th><th>Package</th><th>Travel Date</th><th>Return</th><th>Amount</th><th>Booked At</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {bookings.slice(0, 5).map((b) => (
                          <tr key={b.id || b._id}>
                            <td><strong>{b.customer}</strong><br /><small style={{color:"#888"}}>{b.phone}</small></td>
                            <td>{b.packageTitle || b.item}</td>
                            <td><strong style={{color:"#ff6b00"}}>{fmt(b.travelDate)}</strong></td>
                            <td>{fmt(b.returnDate)}</td>
                            <td className="amount-cell">₹{Number(b.amount || 0).toLocaleString()}</td>
                            <td style={{fontSize:"0.76rem",color:"#888"}}>{fmtTime(b.bookedAt)}</td>
                            <td><span className={`status-badge ${statusClass(b.status)}`}>{b.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

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
              </>
            )}

            {/* ── TOUR BOOKINGS ── */}
            {activeNav === "bookings" && (
              <div className="section-box">
                <h2 className="section-title">
                  Tour Package Bookings
                  <span className="count-pill">{bookings.length}</span>
                </h2>
                <BookingTable data={bookings} isFamous={false} />
              </div>
            )}

            {/* ── FAMOUS BOOKINGS ── */}
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
                <BookingTable data={famousBookings} isFamous={true} />
              </div>
            )}

            {/* ── PACKAGES ── */}
            {activeNav === "packages" && (
              <div className="section-box">
                <h2 className="section-title">Tour Packages <span className="count-pill">{packages.length}</span></h2>
                <div className="table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>Title</th><th>Destination</th><th>Duration</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {packages.map((p) => (
                        <tr key={p._id}>
                          <td><strong>{p.title}</strong></td>
                          <td>📍 {p.destination}</td>
                          <td>{p.duration}</td>
                          <td className="amount-cell">₹{Number(p.price).toLocaleString()}</td>
                          <td><span className={`status-badge ${statusClass(p.status)}`}>{p.status}</span></td>
                          <td><button className="act-btn act-delete" onClick={() => deletePackage(p._id)}><Trash2 size={14} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── VEHICLES ── */}
            {activeNav === "vehicles" && (
              <div className="section-box">
                <h2 className="section-title">Our Vehicles <span className="count-pill">{vehicles.length}</span></h2>
                <div className="table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>Name</th><th>Type</th><th>Seats</th><th>Price/Day</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {vehicles.map((v) => (
                        <tr key={v._id}>
                          <td><strong>{v.name}</strong></td>
                          <td>🚙 {v.type}</td>
                          <td>👥 {v.seats}</td>
                          <td className="amount-cell">₹{Number(v.pricePerDay).toLocaleString()}</td>
                          <td><span className={`status-badge ${statusClass(v.status)}`}>{v.status}</span></td>
                          <td><button className="act-btn act-delete" onClick={() => deleteVehicle(v._id)}><Trash2 size={14} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── CUSTOMERS ── */}
            {activeNav === "customers" && (
              <div className="section-box">
                <h2 className="section-title">Customers <span className="count-pill">{customers.length}</span></h2>
                <div className="table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Actions</th></tr></thead>
                    <tbody>
                      {customers.map((c, i) => (
                        <tr key={c._id}>
                          <td className="muted-cell">{i + 1}</td>
                          <td>
                            <div className="customer-name">
                              <div className="cust-avatar">{c.name.charAt(0)}</div>
                              <strong>{c.name}</strong>
                            </div>
                          </td>
                          <td>{c.email}</td>
                          <td>{c.phone}</td>
                          <td>{fmt(c.createdAt)}</td>
                          <td><button className="act-btn act-delete" onClick={() => deleteCustomer(c._id)}><Trash2 size={14} /></button></td>
                        </tr>
                      ))}
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