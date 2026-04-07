import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/UserDashboard.css";

// ── Import your actual pages ──────────────────────────────────────────────────
import TourPackages from "../pages/TourPackages";   // your Packages page
import OurVehicles  from "../pages/OurVehicles";    // your OurVehicles page

const BASE = "https://d-square-tours-travels.onrender.com/api";

const authHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user,  setUser]  = useState(null);
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState("packages");

  const [bookedPackages, setBookedPackages] = useState([]);
  const [bookedVehicles, setBookedVehicles] = useState([]);
  const [loading, setLoading] = useState({});
  const [error,   setError]   = useState({});

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const storedUser  = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (!storedUser || !storedToken) { navigate("/auth"); return; }
    setUser(JSON.parse(storedUser));
    setToken(storedToken);
  }, [navigate]);

  // ── Fetch user's bookings ───────────────────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    fetchBookedPackages();
    fetchBookedVehicles();
  }, [token]);

  const fetchBookedPackages = async () => {
    setLoading((p) => ({ ...p, bookedPackages: true }));
    try {
      const res  = await fetch(`${BASE}/bookings/packages/me`, { headers: authHeaders(token) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setBookedPackages(data);
    } catch (e) {
      setError((p) => ({ ...p, bookedPackages: e.message }));
    } finally {
      setLoading((p) => ({ ...p, bookedPackages: false }));
    }
  };

  const fetchBookedVehicles = async () => {
    setLoading((p) => ({ ...p, bookedVehicles: true }));
    try {
      const res  = await fetch(`${BASE}/vehicle-bookings/me`, { headers: authHeaders(token) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setBookedVehicles(data);
    } catch (e) {
      setError((p) => ({ ...p, bookedVehicles: e.message }));
    } finally {
      setLoading((p) => ({ ...p, bookedVehicles: false }));
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminAuth");
    window.dispatchEvent(new Event("storage"));
    navigate("/auth");
  };

  const statusClass = (s = "") => {
    switch (s.toLowerCase()) {
      case "confirmed": return "badge-confirmed";
      case "pending":   return "badge-pending";
      case "cancelled": return "badge-cancelled";
      default:          return "badge-default";
    }
  };

  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric",
        })
      : "—";

  const tabs = [
    { id: "packages",   icon: "🗺",  label: "Tour Packages" },
    { id: "vehicles",   icon: "🚗",  label: "Our Vehicles"  },
    { id: "myPackages", icon: "📦",  label: "My Bookings"   },
    { id: "myVehicles", icon: "🔖",  label: "My Vehicles"   },
  ];

  if (!user) return null;

  return (
    <div className="ud-root">

      {/* ── NAVBAR ── */}
      <nav className="ud-navbar">
        <div className="ud-brand">
          <span className="ud-brand-icon">✈</span>
          <span className="ud-brand-name">D Square Tours</span>
        </div>

        <div className="ud-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`ud-tab${activeTab === t.id ? " active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.icon}</span>
              <span className="ud-tab-label">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="ud-user">
          <div className="ud-avatar">{user.name?.charAt(0).toUpperCase()}</div>
          <div className="ud-user-info">
            <span className="ud-greeting">Welcome back</span>
            <span className="ud-uname">{user.name}</span>
          </div>
          <button className="ud-logout" onClick={logout}>Logout</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="ud-hero">
        <div className="ud-hero-left">
          <h1>Hello, <span className="ud-hero-name">{user.name}</span> 👋</h1>
          <p>Plan your next journey, explore packages and track your bookings.</p>
        </div>
        <div className="ud-stats">
          <div className="ud-stat">
            <span className="ud-stat-n">{bookedPackages.length}</span>
            <span className="ud-stat-l">Package Bookings</span>
          </div>
          <div className="ud-stat-sep" />
          <div className="ud-stat">
            <span className="ud-stat-n">{bookedVehicles.length}</span>
            <span className="ud-stat-l">Vehicle Bookings</span>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <main className="ud-main">

        {/* ── Tour Packages tab — renders your actual TourPackages page ── */}
        {activeTab === "packages" && (
          <section className="ud-section">
            <div className="ud-sec-header">
              <h2 className="ud-sec-title">🗺 Tour Packages</h2>
            </div>
            {/* Renders your full TourPackages component with all cards + Book Now buttons */}
            <div className="ud-embedded-page">
              <TourPackages />
            </div>
          </section>
        )}

        {/* ── Our Vehicles tab — renders your actual OurVehicles page ── */}
        {activeTab === "vehicles" && (
          <section className="ud-section">
            <div className="ud-sec-header">
              <h2 className="ud-sec-title">🚗 Our Vehicles</h2>
            </div>
            {/* Renders your full OurVehicles component with all vehicle cards */}
            <div className="ud-embedded-page">
              <OurVehicles />
            </div>
          </section>
        )}

        {/* ── My Package Bookings ── */}
        {activeTab === "myPackages" && (
          <section className="ud-section">
            <div className="ud-sec-header">
              <h2 className="ud-sec-title">📦 My Package Bookings</h2>
              <span className="ud-sec-count">{bookedPackages.length} bookings</span>
            </div>
            {loading.bookedPackages && <Loader text="Loading your bookings" />}
            {error.bookedPackages   && <ErrorBox msg={error.bookedPackages} />}
            <div className="ud-blist">
              {bookedPackages.map((b, i) => (
                <div className="ud-bcard" key={b._id} style={{ animationDelay:`${i*0.08}s` }}>
                  <div className="ud-binfo">
                    <div className="ud-btop">
                      <h3>{b.package?.title || b.packageTitle}</h3>
                      <span className={`ud-badge ${statusClass(b.status)}`}>{b.status}</span>
                    </div>
                    <div className="ud-bmeta">
                      <span>📍 {b.package?.destination || b.pickupLocation}</span>
                      {b.package?.duration && <span>⏱ {b.package.duration}</span>}
                      <span>🗓 Travel: <strong>{fmt(b.travelDate)}</strong></span>
                      {b.returnDate && <span>🏁 Return: <strong>{fmt(b.returnDate)}</strong></span>}
                    </div>
                    <div className="ud-bfoot">
                      <span className="ud-bamount">₹{(b.totalAmount || b.amount)?.toLocaleString()}</span>
                      <span className="ud-bdate">Booked on {fmt(b.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {!loading.bookedPackages && bookedPackages.length === 0 && (
                <EmptyState
                  icon="📭"
                  text="You haven't booked any packages yet."
                  btnText="Explore Packages"
                  onBtn={() => setActiveTab("packages")}
                />
              )}
            </div>
          </section>
        )}

        {/* ── My Vehicle Bookings ── */}
        {activeTab === "myVehicles" && (
          <section className="ud-section">
            <div className="ud-sec-header">
              <h2 className="ud-sec-title">🔖 My Vehicle Bookings</h2>
              <span className="ud-sec-count">{bookedVehicles.length} bookings</span>
            </div>
            {loading.bookedVehicles && <Loader text="Loading your bookings" />}
            {error.bookedVehicles   && <ErrorBox msg={error.bookedVehicles} />}
            <div className="ud-blist">
              {bookedVehicles.map((b, i) => (
                <div className="ud-bcard" key={b._id} style={{ animationDelay:`${i*0.08}s` }}>
                  <div className="ud-binfo">
                    <div className="ud-btop">
                      <h3>{b.vehicle?.name || b.vehicleName}</h3>
                      <span className={`ud-badge ${statusClass(b.status)}`}>{b.status}</span>
                    </div>
                    <div className="ud-bmeta">
                      <span>🚙 {b.vehicle?.type || b.tripType}</span>
                      <span>📅 Travel: <strong>{fmt(b.startDate || b.travelDate)}</strong></span>
                      {(b.endDate || b.returnDate) && (
                        <span>🏁 Return: <strong>{fmt(b.endDate || b.returnDate)}</strong></span>
                      )}
                      <span>📍 {b.pickupLocation}</span>
                    </div>
                    <div className="ud-bfoot">
                      <span className="ud-bamount">{b.vehicle?.pricePerDay || b.rentPerDay || "—"}</span>
                      <span className="ud-bdate">Booked on {fmt(b.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {!loading.bookedVehicles && bookedVehicles.length === 0 && (
                <EmptyState
                  icon="🚗"
                  text="You haven't booked any vehicles yet."
                  btnText="Explore Vehicles"
                  onBtn={() => setActiveTab("vehicles")}
                />
              )}
            </div>
          </section>
        )}

      </main>
    </div>
  );
};

// ── Reusable components ───────────────────────────────────────────────────────
const Loader = ({ text }) => (
  <div className="ud-loader"><span className="ud-spin" />{text}...</div>
);

const ErrorBox = ({ msg }) => (
  <div className="ud-error">⚠ {msg}</div>
);

const EmptyState = ({ icon, text, btnText, onBtn }) => (
  <div className="ud-empty">
    <div className="ud-empty-icon">{icon}</div>
    <p>{text}</p>
    {btnText && <button className="ud-book-btn" onClick={onBtn}>{btnText}</button>}
  </div>
);

export default UserDashboard;