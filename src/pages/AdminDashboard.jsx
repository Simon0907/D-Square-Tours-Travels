import { useState, useEffect } from "react";
import "../css/Admin.css";
import {
  Menu, X, LogOut, BarChart3, Calendar, Package,
  Users, Car, CheckCircle, XCircle, Trash2, Clock, Star, FileText
} from "lucide-react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const BASE     = "http://localhost:5000/api";
const USE_MOCK = true; // ← set false when backend is ready

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

const MOCK_VEHICLES_LIST = [
  { _id: "v1", name: "Mini",                   type: "Hatchback", rentPerDay: "₹1300/-", fuelCharge: "₹8/-",  driverBetta: "₹200/-", status: "available" },
  { _id: "v2", name: "Sedan",                  type: "Sedan",     rentPerDay: "₹1500/-", fuelCharge: "₹9/-",  driverBetta: "₹200/-", status: "available" },
  { _id: "v3", name: "Etios",                  type: "Sedan",     rentPerDay: "₹1500/-", fuelCharge: "₹9/-",  driverBetta: "₹200/-", status: "available" },
  { _id: "v4", name: "SUV (Tavera A/C)",       type: "SUV",       rentPerDay: "₹2000/-", fuelCharge: "₹11/-", driverBetta: "₹300/-", status: "available" },
  { _id: "v5", name: "SUV (Ertiga / Rumion)",  type: "SUV",       rentPerDay: "₹1900/-", fuelCharge: "₹11/-", driverBetta: "₹300/-", status: "available" },
  { _id: "v6", name: "SUV (Innova A/C)",       type: "SUV",       rentPerDay: "₹2200/-", fuelCharge: "₹12/-", driverBetta: "₹300/-", status: "available" },
  { _id: "v7", name: "SUV (Innova Crysta)",    type: "SUV",       rentPerDay: "₹2500/-", fuelCharge: "₹16/-", driverBetta: "₹400/-", status: "booked"    },
  { _id: "v8", name: "Tempo",                  type: "Tempo",     rentPerDay: "₹2600/-", fuelCharge: "₹16/-", driverBetta: "₹500/-", status: "available" },
  { _id: "v9", name: "21 Seater Coach A/C",    type: "Coach",     rentPerDay: "₹5500/-", fuelCharge: "₹25/-", driverBetta: "₹600/-", status: "available" },
  { _id:"v10", name: "21 Seater Coach Non A/C",type: "Coach",     rentPerDay: "₹3600/-", fuelCharge: "₹17/-", driverBetta: "₹500/-", status: "available" },
];

const MOCK_ACTIVITY = [
  { id: 1, text: "New famous package booking",   time: "1 hour ago",   type: "booking"  },
  { id: 2, text: "Vehicle booking confirmed",    time: "3 hours ago",  type: "payment"  },
  { id: 3, text: "New package enquiry received", time: "5 hours ago",  type: "customer" },
  { id: 4, text: "Tour package updated",         time: "Yesterday",    type: "package"  },
];

// ─── SAMPLE FALLBACK DATA (shows when localStorage is empty) ─────────────────
const SAMPLE_TOUR_BOOKINGS = [
  {
    id: "BK-001", customer: "Arun Kumar", phone: "9876543210", email: "arun@gmail.com",
    type: "Package", packageTitle: "Kerala Backwaters",
    travelDate: "2025-08-15", returnDate: "2025-08-20", numberOfDays: 5,
    vehicle: "SUV (Innova)", acType: "AC", numberOfPersons: "4",
    pickupLocation: "Madurai", amount: 29700, status: "pending",
    bookedAt: new Date().toISOString(),
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
    bookedAt: new Date().toISOString(),
  },
];

const SAMPLE_PACKAGE_ENQUIRIES = [
  {
    id: "ENQ-001", customer: "Ravi Mohan", phone: "9988776655",
    type: "Package Enquiry", packageTitle: "Ooty Nilgiri Hills",
    travelDate: "2025-07-20", travelTime: "07:00", returnDate: "2025-07-23",
    pickupLocation: "Coimbatore", numberOfPersons: "3",
    status: "pending", bookedAt: new Date().toISOString(),
  },
];

const SAMPLE_VEHICLE_BOOKINGS = [
  {
    id: "VEH-001", customer: "Sneha Pillai", phone: "9001122334",
    type: "Vehicle Booking", vehicleName: "SUV (Innova Crysta)",
    rentPerDay: "₹2500/-", driverBetta: "₹400/-",
    travelDate: "2025-08-10", travelTime: "08:00", returnDate: "2025-08-12",
    tripType: "Round Trip", pickupLocation: "Madurai", dropLocation: "Ooty",
    numberOfPersons: "5", status: "pending",
    bookedAt: new Date().toISOString(),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav,   setActiveNav]   = useState("dashboard");

  const [tourBookings,      setTourBookings]      = useState([]);
  const [famousBookings,    setFamousBookings]     = useState([]);
  const [packageEnquiries,  setPackageEnquiries]  = useState([]);
  const [vehicleBookings,   setVehicleBookings]   = useState([]);
  const [customers,         setCustomers]         = useState([]);
  const [packages,          setPackages]          = useState([]);
  const [vehiclesList,      setVehiclesList]      = useState([]);
  const [activity,          setActivity]          = useState([]);
  const [loading,           setLoading]           = useState(true);

  // ── Load all data ──────────────────────────────────────────────────────────
  useEffect(() => {
    const loadData = () => {
      const tb = JSON.parse(localStorage.getItem("adminBookings"))          || [];
      const fb = JSON.parse(localStorage.getItem("adminFamousBookings"))    || [];
      const pe = JSON.parse(localStorage.getItem("adminPackageEnquiries"))  || [];
      const vb = JSON.parse(localStorage.getItem("adminVehicleBookings"))   || [];

      setTourBookings(tb.length     > 0 ? tb : SAMPLE_TOUR_BOOKINGS);
      setFamousBookings(fb.length   > 0 ? fb : SAMPLE_FAMOUS_BOOKINGS);
      setPackageEnquiries(pe.length > 0 ? pe : SAMPLE_PACKAGE_ENQUIRIES);
      setVehicleBookings(vb.length  > 0 ? vb : SAMPLE_VEHICLE_BOOKINGS);
      setCustomers(MOCK_CUSTOMERS);
      setPackages(MOCK_PACKAGES);
      setVehiclesList(MOCK_VEHICLES_LIST);
      setActivity(MOCK_ACTIVITY);
      setLoading(false);
    };

    if (USE_MOCK) {
      setTimeout(loadData, 500);
    } else {
      fetchAll();
    }

    // Re-read when any form saves new booking
    const onStorage = () => {
      const tb = JSON.parse(localStorage.getItem("adminBookings"))         || [];
      const fb = JSON.parse(localStorage.getItem("adminFamousBookings"))   || [];
      const pe = JSON.parse(localStorage.getItem("adminPackageEnquiries")) || [];
      const vb = JSON.parse(localStorage.getItem("adminVehicleBookings"))  || [];
      if (tb.length > 0) setTourBookings(tb);
      if (fb.length > 0) setFamousBookings(fb);
      if (pe.length > 0) setPackageEnquiries(pe);
      if (vb.length > 0) setVehicleBookings(vb);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ── Real API calls ─────────────────────────────────────────────────────────
  /**
   * Backend endpoints needed:
   * GET /api/admin/bookings           → tour bookings
   * GET /api/admin/famous-bookings    → famous package bookings
   * GET /api/admin/package-enquiries  → package enquiries
   * GET /api/admin/vehicle-bookings   → vehicle bookings
   * GET /api/admin/customers
   * GET /api/admin/packages
   * GET /api/admin/vehicles
   * PATCH /api/admin/bookings/:id/status  { status }
   * DELETE /api/admin/bookings/:id
   */
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [tbR, fbR, peR, vbR, cR, pR, vR] = await Promise.all([
        fetch(`${BASE}/admin/bookings`,           { headers: authHeaders() }),
        fetch(`${BASE}/admin/famous-bookings`,    { headers: authHeaders() }),
        fetch(`${BASE}/admin/package-enquiries`,  { headers: authHeaders() }),
        fetch(`${BASE}/admin/vehicle-bookings`,   { headers: authHeaders() }),
        fetch(`${BASE}/admin/customers`,          { headers: authHeaders() }),
        fetch(`${BASE}/admin/packages`,           { headers: authHeaders() }),
        fetch(`${BASE}/admin/vehicles`,           { headers: authHeaders() }),
      ]);
      const [tb, fb, pe, vb, c, p, v] = await Promise.all([
        tbR.json(), fbR.json(), peR.json(), vbR.json(), cR.json(), pR.json(), vR.json()
      ]);
      setTourBookings(tb);  setFamousBookings(fb);
      setPackageEnquiries(pe); setVehicleBookings(vb);
      setCustomers(c); setPackages(p); setVehiclesList(v);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // ── Status update ──────────────────────────────────────────────────────────
  const updateStatus = (id, status, storeKey, setter) => {
    setter((prev) => {
      const updated = prev.map((b) =>
        (b.id === id || b._id === id) ? { ...b, status } : b
      );
      localStorage.setItem(storeKey, JSON.stringify(updated));
      return updated;
    });
    if (!USE_MOCK) {
      fetch(`${BASE}/admin/bookings/${id}/status`, {
        method: "PATCH", headers: authHeaders(), body: JSON.stringify({ status }),
      });
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const deleteEntry = (id, storeKey, setter) => {
    if (!window.confirm("Delete this entry?")) return;
    setter((prev) => {
      const updated = prev.filter((b) => b.id !== id && b._id !== id);
      localStorage.setItem(storeKey, JSON.stringify(updated));
      return updated;
    });
  };

  const deletePackage  = (id) => { if (window.confirm("Delete?")) setPackages((p) => p.filter((x) => x._id !== id)); };
  const deleteVehicle  = (id) => { if (window.confirm("Delete?")) setVehiclesList((p) => p.filter((x) => x._id !== id)); };
  const deleteCustomer = (id) => { if (window.confirm("Delete?")) setCustomers((p) => p.filter((x) => x._id !== id)); };

  const logout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth";
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const allBookings  = [...tourBookings, ...famousBookings, ...vehicleBookings];
  const totalRevenue = allBookings
    .filter((b) => b.status === "confirmed")
    .reduce((s, b) => s + (Number(b.amount) || 0), 0);
  const totalPending = [...allBookings, ...packageEnquiries]
    .filter((b) => b.status === "pending").length;

  const statusClass = (s = "") => {
    switch (s.toLowerCase()) {
      case "confirmed": case "active": case "available": return "badge-green";
      case "pending":                                     return "badge-yellow";
      case "cancelled": case "inactive": case "booked":  return "badge-red";
      default: return "badge-grey";
    }
  };

  const actIcon = (t) =>
    ({ booking:"📅", payment:"💰", customer:"👤", package:"🗺", cancel:"❌" }[t] || "🔔");

  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "—";
  const fmtTime = (d) =>
    d ? new Date(d).toLocaleString("en-IN", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" }) : "—";

  // ── Action buttons ─────────────────────────────────────────────────────────
  const ActionBtns = ({ b, storeKey, setter }) => (
    <div className="action-btns">
      {b.status === "pending" && (
        <>
          <button className="act-btn act-confirm" title="Confirm"
            onClick={() => updateStatus(b.id || b._id, "confirmed", storeKey, setter)}>
            <CheckCircle size={14} />
          </button>
          <button className="act-btn act-cancel" title="Cancel"
            onClick={() => updateStatus(b.id || b._id, "cancelled", storeKey, setter)}>
            <XCircle size={14} />
          </button>
        </>
      )}
      <button className="act-btn act-delete" title="Delete"
        onClick={() => deleteEntry(b.id || b._id, storeKey, setter)}>
        <Trash2 size={14} />
      </button>
    </div>
  );

  const menuItems = [
    { id: "dashboard",        label: "Dashboard",          icon: BarChart3, count: null },
    { id: "tourBookings",     label: "Tour Bookings",      icon: Calendar,  count: tourBookings.length },
    { id: "famousBookings",   label: "Famous Bookings",    icon: Star,      count: famousBookings.length },
    { id: "packageEnquiries", label: "Package Enquiries",  icon: FileText,  count: packageEnquiries.filter(e=>e.status==="pending").length },
    { id: "vehicleBookings",  label: "Vehicle Bookings",   icon: Car,       count: vehicleBookings.length },
    { id: "packages",         label: "Packages",           icon: Package,   count: null },
    { id: "vehicles",         label: "Vehicles",           icon: Car,       count: null },
    { id: "customers",        label: "Customers",          icon: Users,     count: null },
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
            <h1>{menuItems.find((m) => m.id === activeNav)?.label}</h1>
            {USE_MOCK && <span className="mock-badge">🟡 Mock Mode — set USE_MOCK=false when backend ready</span>}
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

            {/* ══════════════════ DASHBOARD ══════════════════ */}
            {activeNav === "dashboard" && (
              <>
                {/* Stat Cards */}
                <div className="cards-grid">
                  {[
                    { label: "Tour Bookings",     value: tourBookings.length,     icon: Calendar,   color: "blue"   },
                    { label: "Famous Bookings",   value: famousBookings.length,   icon: Star,       color: "orange" },
                    { label: "Package Enquiries", value: packageEnquiries.length, icon: FileText,   color: "purple" },
                    { label: "Vehicle Bookings",  value: vehicleBookings.length,  icon: Car,        color: "teal"   },
                    { label: "Pending Actions",   value: totalPending,            icon: Clock,      color: "yellow" },
                    { label: "Total Revenue",     value: `₹${totalRevenue.toLocaleString()}`, icon: BarChart3, color: "green" },
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

                {/* Quick previews */}
                {[
                  { title: "⭐ Famous Package Bookings", data: famousBookings.slice(0,3), cols: ["Customer","Travel Date","Time","Vehicle","Amount","Status"],
                    row: (b) => [<><strong>{b.customer}</strong><br/><small style={{color:"#888"}}>{b.phone}</small></>, <strong style={{color:"#ff6b00"}}>{fmt(b.travelDate)}</strong>, b.travelTime||"—", b.vehicle, `₹${Number(b.amount||0).toLocaleString()}`, <span className={`status-badge ${statusClass(b.status)}`}>{b.status}</span>]
                  },
                  { title: "📅 Tour Bookings", data: tourBookings.slice(0,3), cols: ["Customer","Package","Travel Date","Return","Amount","Status"],
                    row: (b) => [<><strong>{b.customer}</strong><br/><small style={{color:"#888"}}>{b.phone}</small></>, b.packageTitle||b.item, <strong style={{color:"#ff6b00"}}>{fmt(b.travelDate)}</strong>, fmt(b.returnDate), `₹${Number(b.amount||0).toLocaleString()}`, <span className={`status-badge ${statusClass(b.status)}`}>{b.status}</span>]
                  },
                  { title: "📋 Package Enquiries", data: packageEnquiries.slice(0,3), cols: ["Customer","Package","Travel Date","Time","Persons","Status"],
                    row: (b) => [<><strong>{b.customer}</strong><br/><small style={{color:"#888"}}>{b.phone}</small></>, b.packageTitle, <strong style={{color:"#ff6b00"}}>{fmt(b.travelDate)}</strong>, b.travelTime||"—", b.numberOfPersons||"—", <span className={`status-badge ${statusClass(b.status)}`}>{b.status}</span>]
                  },
                  { title: "🚗 Vehicle Bookings", data: vehicleBookings.slice(0,3), cols: ["Customer","Vehicle","Travel Date","Time","Trip Type","Status"],
                    row: (b) => [<><strong>{b.customer}</strong><br/><small style={{color:"#888"}}>{b.phone}</small></>, b.vehicleName, <strong style={{color:"#ff6b00"}}>{fmt(b.travelDate)}</strong>, b.travelTime||"—", b.tripType||"—", <span className={`status-badge ${statusClass(b.status)}`}>{b.status}</span>]
                  },
                ].map(({ title, data, cols, row }, si) => (
                  <div className="section-box" key={si}>
                    <h2 className="section-title">{title}</h2>
                    <div className="table-wrap">
                      <table className="admin-table">
                        <thead><tr>{cols.map((c,i) => <th key={i}>{c}</th>)}</tr></thead>
                        <tbody>
                          {data.map((b,i) => (
                            <tr key={i}>{row(b).map((cell,j) => <td key={j}>{cell}</td>)}</tr>
                          ))}
                          {data.length === 0 && <tr><td colSpan={cols.length} style={{textAlign:"center",padding:"1.5rem",color:"#aaa"}}>No entries yet</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}

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

            {/* ══════════════════ TOUR BOOKINGS ══════════════════ */}
            {activeNav === "tourBookings" && (
              <div className="section-box">
                <h2 className="section-title">Tour Package Bookings <span className="count-pill">{tourBookings.length}</span></h2>
                <div className="table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr><th>ID</th><th>Customer</th><th>Package</th><th>Travel Date</th><th>Return Date</th><th>Days</th><th>Vehicle</th><th>Persons</th><th>Pickup</th><th>Amount</th><th>Booked At</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {tourBookings.map((b) => (
                        <tr key={b.id||b._id}>
                          <td className="muted-cell" style={{fontSize:"0.72rem"}}>{b.id||b._id}</td>
                          <td><strong>{b.customer}</strong><br/><small style={{color:"#888"}}>{b.email}</small><br/><small style={{color:"#888"}}>{b.phone}</small></td>
                          <td>{b.packageTitle||b.item}</td>
                          <td><strong style={{color:"#ff6b00"}}>{fmt(b.travelDate)}</strong></td>
                          <td>{fmt(b.returnDate)}</td>
                          <td style={{textAlign:"center"}}>{b.numberOfDays||"—"}</td>
                          <td style={{fontSize:"0.82rem"}}>{b.vehicle||"—"} {b.acType?`(${b.acType})`:""}</td>
                          <td style={{textAlign:"center"}}>{b.numberOfPersons||"—"}</td>
                          <td>{b.pickupLocation||"—"}</td>
                          <td className="amount-cell">₹{Number(b.amount||0).toLocaleString()}</td>
                          <td style={{fontSize:"0.76rem",color:"#888",whiteSpace:"nowrap"}}>{fmtTime(b.bookedAt)}</td>
                          <td><span className={`status-badge ${statusClass(b.status)}`}>{b.status}</span></td>
                          <td><ActionBtns b={b} storeKey="adminBookings" setter={setTourBookings} /></td>
                        </tr>
                      ))}
                      {tourBookings.length===0 && <tr><td colSpan={13} style={{textAlign:"center",padding:"3rem",color:"#aaa"}}>No tour bookings yet</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══════════════════ FAMOUS BOOKINGS ══════════════════ */}
            {activeNav === "famousBookings" && (
              <div className="section-box">
                <div className="famous-header-bar">
                  <h2 className="section-title">⭐ Famous Package Bookings <span className="count-pill famous-pill">{famousBookings.length}</span></h2>
                  <p className="famous-route-note">Madurai → Rameswaram → Kanyakumari → Thiruvananthapuram (5 Days)</p>
                </div>
                <div className="table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr><th>ID</th><th>Customer</th><th>Route</th><th>Travel Date</th><th>Pickup Time</th><th>Return Date</th><th>Vehicle</th><th>Persons</th><th>Pickup</th><th>Amount</th><th>Booked At</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {famousBookings.map((b) => (
                        <tr key={b.id||b._id}>
                          <td className="muted-cell" style={{fontSize:"0.72rem"}}>{b.id||b._id}</td>
                          <td><strong>{b.customer}</strong><br/><small style={{color:"#888"}}>{b.phone}</small></td>
                          <td style={{fontSize:"0.78rem",maxWidth:180}}>{b.route}</td>
                          <td><strong style={{color:"#ff6b00"}}>{fmt(b.travelDate)}</strong></td>
                          <td><strong>{b.travelTime||"—"}</strong></td>
                          <td>{fmt(b.returnDate)}</td>
                          <td>{b.vehicle||"—"}</td>
                          <td style={{textAlign:"center"}}>{b.numberOfPersons||"—"}</td>
                          <td>{b.pickupLocation||"—"}</td>
                          <td className="amount-cell">₹{Number(b.amount||0).toLocaleString()}</td>
                          <td style={{fontSize:"0.76rem",color:"#888",whiteSpace:"nowrap"}}>{fmtTime(b.bookedAt)}</td>
                          <td><span className={`status-badge ${statusClass(b.status)}`}>{b.status}</span></td>
                          <td><ActionBtns b={b} storeKey="adminFamousBookings" setter={setFamousBookings} /></td>
                        </tr>
                      ))}
                      {famousBookings.length===0 && <tr><td colSpan={13} style={{textAlign:"center",padding:"3rem",color:"#aaa"}}>No famous bookings yet</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══════════════════ PACKAGE ENQUIRIES ══════════════════ */}
            {activeNav === "packageEnquiries" && (
              <div className="section-box">
                <h2 className="section-title">📋 Package Enquiries <span className="count-pill">{packageEnquiries.length}</span></h2>
                <div className="table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr><th>ID</th><th>Customer</th><th>Package</th><th>Travel Date</th><th>Time</th><th>Return Date</th><th>Persons</th><th>Pickup</th><th>Enquired At</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {packageEnquiries.map((b) => (
                        <tr key={b.id||b._id}>
                          <td className="muted-cell" style={{fontSize:"0.72rem"}}>{b.id||b._id}</td>
                          <td><strong>{b.customer}</strong><br/><small style={{color:"#888"}}>{b.phone}</small></td>
                          <td>{b.packageTitle}</td>
                          <td><strong style={{color:"#ff6b00"}}>{fmt(b.travelDate)}</strong></td>
                          <td><strong>{b.travelTime||"—"}</strong></td>
                          <td>{fmt(b.returnDate)}</td>
                          <td style={{textAlign:"center"}}>{b.numberOfPersons||"—"}</td>
                          <td>{b.pickupLocation||"—"}</td>
                          <td style={{fontSize:"0.76rem",color:"#888",whiteSpace:"nowrap"}}>{fmtTime(b.bookedAt)}</td>
                          <td><span className={`status-badge ${statusClass(b.status)}`}>{b.status}</span></td>
                          <td><ActionBtns b={b} storeKey="adminPackageEnquiries" setter={setPackageEnquiries} /></td>
                        </tr>
                      ))}
                      {packageEnquiries.length===0 && <tr><td colSpan={11} style={{textAlign:"center",padding:"3rem",color:"#aaa"}}>No enquiries yet</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══════════════════ VEHICLE BOOKINGS ══════════════════ */}
            {activeNav === "vehicleBookings" && (
              <div className="section-box">
                <h2 className="section-title">🚗 Vehicle Bookings <span className="count-pill">{vehicleBookings.length}</span></h2>
                <div className="table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr><th>ID</th><th>Customer</th><th>Vehicle</th><th>Trip Type</th><th>Travel Date</th><th>Time</th><th>Return Date</th><th>Persons</th><th>Pickup</th><th>Drop</th><th>Rent/Day</th><th>Booked At</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {vehicleBookings.map((b) => (
                        <tr key={b.id||b._id}>
                          <td className="muted-cell" style={{fontSize:"0.72rem"}}>{b.id||b._id}</td>
                          <td><strong>{b.customer}</strong><br/><small style={{color:"#888"}}>{b.phone}</small></td>
                          <td><strong>{b.vehicleName||"—"}</strong></td>
                          <td><span className={`type-pill ${b.tripType==="Round Trip"?"type-pkg":"type-veh"}`}>{b.tripType||"—"}</span></td>
                          <td><strong style={{color:"#ff6b00"}}>{fmt(b.travelDate)}</strong></td>
                          <td><strong>{b.travelTime||"—"}</strong></td>
                          <td>{b.returnDate ? fmt(b.returnDate) : "—"}</td>
                          <td style={{textAlign:"center"}}>{b.numberOfPersons||"—"}</td>
                          <td>{b.pickupLocation||"—"}</td>
                          <td>{b.dropLocation||"—"}</td>
                          <td className="amount-cell" style={{fontSize:"0.82rem"}}>{b.rentPerDay||"—"}</td>
                          <td style={{fontSize:"0.76rem",color:"#888",whiteSpace:"nowrap"}}>{fmtTime(b.bookedAt)}</td>
                          <td><span className={`status-badge ${statusClass(b.status)}`}>{b.status}</span></td>
                          <td><ActionBtns b={b} storeKey="adminVehicleBookings" setter={setVehicleBookings} /></td>
                        </tr>
                      ))}
                      {vehicleBookings.length===0 && <tr><td colSpan={14} style={{textAlign:"center",padding:"3rem",color:"#aaa"}}>No vehicle bookings yet</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══════════════════ PACKAGES ══════════════════ */}
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
                          <td><button className="act-btn act-delete" onClick={() => deletePackage(p._id)}><Trash2 size={14}/></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══════════════════ VEHICLES ══════════════════ */}
            {activeNav === "vehicles" && (
              <div className="section-box">
                <h2 className="section-title">Our Vehicles <span className="count-pill">{vehiclesList.length}</span></h2>
                <div className="table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>Name</th><th>Type</th><th>Rent/Day</th><th>Fuel Charge/km</th><th>Driver Betta</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {vehiclesList.map((v) => (
                        <tr key={v._id}>
                          <td><strong>{v.name}</strong></td>
                          <td>🚙 {v.type}</td>
                          <td className="amount-cell" style={{fontSize:"0.88rem"}}>{v.rentPerDay}</td>
                          <td>{v.fuelCharge}</td>
                          <td>{v.driverBetta}</td>
                          <td><span className={`status-badge ${statusClass(v.status)}`}>{v.status}</span></td>
                          <td><button className="act-btn act-delete" onClick={() => deleteVehicle(v._id)}><Trash2 size={14}/></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══════════════════ CUSTOMERS ══════════════════ */}
            {activeNav === "customers" && (
              <div className="section-box">
                <h2 className="section-title">Customers <span className="count-pill">{customers.length}</span></h2>
                <div className="table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Actions</th></tr></thead>
                    <tbody>
                      {customers.map((c, i) => (
                        <tr key={c._id}>
                          <td className="muted-cell">{i+1}</td>
                          <td>
                            <div className="customer-name">
                              <div className="cust-avatar">{c.name.charAt(0)}</div>
                              <strong>{c.name}</strong>
                            </div>
                          </td>
                          <td>{c.email}</td>
                          <td>{c.phone}</td>
                          <td>{fmt(c.createdAt)}</td>
                          <td><button className="act-btn act-delete" onClick={() => deleteCustomer(c._id)}><Trash2 size={14}/></button></td>
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