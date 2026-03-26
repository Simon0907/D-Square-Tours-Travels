import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/UserDashboard.css";

// ─── BASE URL — change this when backend is ready ────────────────────────────
const BASE = "http://localhost:5000/api";

// ─── MOCK DATA — delete this block when backend is ready ─────────────────────
const MOCK_PACKAGES = [
  {
    _id: "p1", title: "Kerala Backwaters Escape", destination: "Kerala, India",
    duration: "5 Days / 4 Nights", price: 18500,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80",
    description: "Cruise through serene backwaters on a houseboat, explore spice gardens and pristine beaches.",
  },
  {
    _id: "p2", title: "Rajasthan Royal Tour", destination: "Rajasthan, India",
    duration: "7 Days / 6 Nights", price: 24000,
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80",
    description: "Forts, palaces and desert landscapes — experience the royal heritage of Rajasthan.",
  },
  {
    _id: "p3", title: "Ooty Nilgiri Hills", destination: "Ooty, Tamil Nadu",
    duration: "3 Days / 2 Nights", price: 9500,
    image: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=600&q=80",
    description: "Toy train rides, tea gardens and cool mountain air in the queen of hill stations.",
  },
  {
    _id: "p4", title: "Goa Beach Fiesta", destination: "Goa, India",
    duration: "4 Days / 3 Nights", price: 14000,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80",
    description: "Sun, sand and seafood — the perfect getaway with water sports and vibrant nightlife.",
  },
];

const MOCK_VEHICLES = [
  {
    _id: "v1", name: "Toyota Innova Crysta", type: "SUV", seats: 7, pricePerDay: 3500,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80",
    description: "Spacious and comfortable SUV, perfect for family trips and long highway journeys.",
  },
  {
    _id: "v2", name: "Tempo Traveller 12-Seater", type: "Mini Bus", seats: 12, pricePerDay: 5500,
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&q=80",
    description: "Ideal for group tours with push-back seats, music system and ample luggage space.",
  },
  {
    _id: "v3", name: "Swift Dzire", type: "Sedan", seats: 4, pricePerDay: 1800,
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80",
    description: "Fuel-efficient sedan great for city transfers and short distance travel.",
  },
  {
    _id: "v4", name: "Luxury Mercedes Sprinter", type: "Luxury Van", seats: 9, pricePerDay: 9000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    description: "Premium van with leather seats, AC and entertainment system for VIP travel.",
  },
];

const MOCK_BOOKED_PACKAGES = [
  {
    _id: "bp1", package: MOCK_PACKAGES[0],
    travelDate: "2025-08-15", status: "confirmed",
    totalAmount: 18500, createdAt: "2025-06-01",
  },
  {
    _id: "bp2", package: MOCK_PACKAGES[2],
    travelDate: "2025-07-20", status: "pending",
    totalAmount: 9500, createdAt: "2025-06-10",
  },
];

const MOCK_BOOKED_VEHICLES = [
  {
    _id: "bv1", vehicle: MOCK_VEHICLES[0],
    startDate: "2025-08-15", endDate: "2025-08-20",
    status: "confirmed", totalAmount: 17500, createdAt: "2025-06-01",
  },
];
// ─── END MOCK DATA ────────────────────────────────────────────────────────────

// ✅ Set to false when your backend is ready
const USE_MOCK = true;

const authHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user,  setUser]  = useState(null);
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState("packages");

  const [tourPackages,   setTourPackages]   = useState([]);
  const [ourVehicles,    setOurVehicles]    = useState([]);
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

  // ── Load data ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    if (USE_MOCK) {
      setLoading({ packages: true, vehicles: true, bookedPackages: true, bookedVehicles: true });
      setTimeout(() => {
        setTourPackages(MOCK_PACKAGES);
        setOurVehicles(MOCK_VEHICLES);
        setBookedPackages(MOCK_BOOKED_PACKAGES);
        setBookedVehicles(MOCK_BOOKED_VEHICLES);
        setLoading({});
      }, 700);
    } else {
      fetchTourPackages();
      fetchOurVehicles();
      fetchBookedPackages();
      fetchBookedVehicles();
    }
  }, [token]);

  // ── Real API calls ──────────────────────────────────────────────────────────
  const fetchTourPackages = async () => {
    setLoading((p) => ({ ...p, packages: true }));
    try {
      const res = await fetch(`${BASE}/packages`, { headers: authHeaders(token) });
      const d   = await res.json();
      if (!res.ok) throw new Error(d.message);
      setTourPackages(d);
    } catch (e) { setError((p) => ({ ...p, packages: e.message })); }
    finally     { setLoading((p) => ({ ...p, packages: false })); }
  };

  const fetchOurVehicles = async () => {
    setLoading((p) => ({ ...p, vehicles: true }));
    try {
      const res = await fetch(`${BASE}/vehicles`, { headers: authHeaders(token) });
      const d   = await res.json();
      if (!res.ok) throw new Error(d.message);
      setOurVehicles(d);
    } catch (e) { setError((p) => ({ ...p, vehicles: e.message })); }
    finally     { setLoading((p) => ({ ...p, vehicles: false })); }
  };

  const fetchBookedPackages = async () => {
    setLoading((p) => ({ ...p, bookedPackages: true }));
    try {
      const res = await fetch(`${BASE}/bookings/packages/me`, { headers: authHeaders(token) });
      const d   = await res.json();
      if (!res.ok) throw new Error(d.message);
      setBookedPackages(d);
    } catch (e) { setError((p) => ({ ...p, bookedPackages: e.message })); }
    finally     { setLoading((p) => ({ ...p, bookedPackages: false })); }
  };

  const fetchBookedVehicles = async () => {
    setLoading((p) => ({ ...p, bookedVehicles: true }));
    try {
      const res = await fetch(`${BASE}/bookings/vehicles/me`, { headers: authHeaders(token) });
      const d   = await res.json();
      if (!res.ok) throw new Error(d.message);
      setBookedVehicles(d);
    } catch (e) { setError((p) => ({ ...p, bookedVehicles: e.message })); }
    finally     { setLoading((p) => ({ ...p, bookedVehicles: false })); }
  };

  // ── Logout ──────────────────────────────────────────────────────────────────
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

  const tabs = [
    { id: "packages",   icon: "🗺",  label: "Tour Packages" },
    { id: "vehicles",   icon: "🚗",  label: "Our Vehicles"  },
    { id: "myPackages", icon: "📦",  label: "My Bookings"   },
    { id: "myVehicles", icon: "🔖",  label: "My Vehicles"   },
  ];

  if (!user) return null;

  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <div className="ud-root">

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
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

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
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
          <div className="ud-stat-sep" />
          <div className="ud-stat">
            <span className="ud-stat-n">{tourPackages.length}</span>
            <span className="ud-stat-l">Packages Available</span>
          </div>
        </div>
      </div>

      {/* ── MAIN ───────────────────────────────────────────────────────────── */}
      <main className="ud-main">

        {/* Tour Packages */}
        {activeTab === "packages" && (
          <section className="ud-section">
            <SectionHeader title="🗺 Available Tour Packages" count={tourPackages.length} unit="packages" />
            {loading.packages && <Loader text="Loading packages" />}
            {error.packages   && <ErrorBox msg={error.packages} />}
            <div className="ud-grid">
              {tourPackages.map((pkg, i) => (
                <div className="ud-card" key={pkg._id} style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="ud-card-img-wrap">
                    <img src={pkg.image} alt={pkg.title} className="ud-card-img" />
                    <span className="ud-card-badge">{pkg.duration}</span>
                  </div>
                  <div className="ud-card-body">
                    <h3 className="ud-card-title">{pkg.title}</h3>
                    <p className="ud-card-sub">📍 {pkg.destination}</p>
                    <p className="ud-card-desc">{pkg.description}</p>
                    <div className="ud-card-foot">
                      <div>
                        <div className="ud-price-lbl">Starting from</div>
                        <div className="ud-price">₹{pkg.price?.toLocaleString()}</div>
                      </div>
                      <button className="ud-book-btn" onClick={() => navigate(`/packages/${pkg._id}`)}>
                        Book Now →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {!loading.packages && tourPackages.length === 0 && <EmptyState icon="🗺" text="No packages available." />}
            </div>
          </section>
        )}

        {/* Our Vehicles */}
        {activeTab === "vehicles" && (
          <section className="ud-section">
            <SectionHeader title="🚗 Our Vehicles" count={ourVehicles.length} unit="vehicles" />
            {loading.vehicles && <Loader text="Loading vehicles" />}
            {error.vehicles   && <ErrorBox msg={error.vehicles} />}
            <div className="ud-grid">
              {ourVehicles.map((v, i) => (
                <div className="ud-card" key={v._id} style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="ud-card-img-wrap">
                    <img src={v.image} alt={v.name} className="ud-card-img" />
                    <span className="ud-card-badge">👥 {v.seats} Seats</span>
                  </div>
                  <div className="ud-card-body">
                    <h3 className="ud-card-title">{v.name}</h3>
                    <p className="ud-card-sub">🚙 {v.type}</p>
                    <p className="ud-card-desc">{v.description}</p>
                    <div className="ud-card-foot">
                      <div>
                        <div className="ud-price-lbl">Per Day</div>
                        <div className="ud-price">₹{v.pricePerDay?.toLocaleString()}</div>
                      </div>
                      <button className="ud-book-btn" onClick={() => navigate(`/vehicles/${v._id}`)}>
                        Book Now →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {!loading.vehicles && ourVehicles.length === 0 && <EmptyState icon="🚗" text="No vehicles available." />}
            </div>
          </section>
        )}

        {/* My Package Bookings */}
        {activeTab === "myPackages" && (
          <section className="ud-section">
            <SectionHeader title="📦 My Package Bookings" count={bookedPackages.length} unit="bookings" />
            {loading.bookedPackages && <Loader text="Loading bookings" />}
            {error.bookedPackages   && <ErrorBox msg={error.bookedPackages} />}
            <div className="ud-blist">
              {bookedPackages.map((b, i) => (
                <div className="ud-bcard" key={b._id} style={{ animationDelay: `${i * 0.08}s` }}>
                  {b.package?.image && <img src={b.package.image} alt="" className="ud-bimg" />}
                  <div className="ud-binfo">
                    <div className="ud-btop">
                      <h3>{b.package?.title}</h3>
                      <span className={`ud-badge ${statusClass(b.status)}`}>{b.status}</span>
                    </div>
                    <div className="ud-bmeta">
                      <span>📍 {b.package?.destination}</span>
                      <span>⏱ {b.package?.duration}</span>
                      <span>🗓 Travel: <strong>{fmt(b.travelDate)}</strong></span>
                    </div>
                    <div className="ud-bfoot">
                      <span className="ud-bamount">₹{b.totalAmount?.toLocaleString()}</span>
                      <span className="ud-bdate">Booked on {fmt(b.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {!loading.bookedPackages && bookedPackages.length === 0 && (
                <EmptyState icon="📭" text="No package bookings yet." btnText="Explore Packages" onBtn={() => setActiveTab("packages")} />
              )}
            </div>
          </section>
        )}

        {/* My Vehicle Bookings */}
        {activeTab === "myVehicles" && (
          <section className="ud-section">
            <SectionHeader title="🔖 My Vehicle Bookings" count={bookedVehicles.length} unit="bookings" />
            {loading.bookedVehicles && <Loader text="Loading bookings" />}
            {error.bookedVehicles   && <ErrorBox msg={error.bookedVehicles} />}
            <div className="ud-blist">
              {bookedVehicles.map((b, i) => (
                <div className="ud-bcard" key={b._id} style={{ animationDelay: `${i * 0.08}s` }}>
                  {b.vehicle?.image && <img src={b.vehicle.image} alt="" className="ud-bimg" />}
                  <div className="ud-binfo">
                    <div className="ud-btop">
                      <h3>{b.vehicle?.name}</h3>
                      <span className={`ud-badge ${statusClass(b.status)}`}>{b.status}</span>
                    </div>
                    <div className="ud-bmeta">
                      <span>🚙 {b.vehicle?.type}</span>
                      <span>👥 {b.vehicle?.seats} Seats</span>
                      <span>📅 {fmt(b.startDate)} → {fmt(b.endDate)}</span>
                    </div>
                    <div className="ud-bfoot">
                      <span className="ud-bamount">₹{b.totalAmount?.toLocaleString()}</span>
                      <span className="ud-bdate">Booked on {fmt(b.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {!loading.bookedVehicles && bookedVehicles.length === 0 && (
                <EmptyState icon="🚗" text="No vehicle bookings yet." btnText="Explore Vehicles" onBtn={() => setActiveTab("vehicles")} />
              )}
            </div>
          </section>
        )}

      </main>
    </div>
  );
};

// ── Reusable sub-components ───────────────────────────────────────────────────
const SectionHeader = ({ title, count, unit }) => (
  <div className="ud-sec-header">
    <h2 className="ud-sec-title">{title}</h2>
    <span className="ud-sec-count">{count} {unit}</span>
  </div>
);

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