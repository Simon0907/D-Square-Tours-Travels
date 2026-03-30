const express = require("express");
const router  = express.Router();

// ── Static package data (your real packages from TourPackages.jsx) ────────────
// When your backend friend connects a DB, replace this with a Package model
const packages = [
  {
    _id:         "p1",
    title:       "Madurai Tour Package",
    destination: "Madurai, Tamil Nadu",
    duration:    "1 Day",
    price:       2500,
    image:       "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Meenakshi_Amman_Temple_Madurai.jpg/640px-Meenakshi_Amman_Temple_Madurai.jpg",
    description: "Meenakshi Amman Temple, Thirumalai Nayakkar Mahal, Gandhi Memorial Museum.",
  },
  {
    _id:         "p2",
    title:       "Rameswaram Tour Package",
    destination: "Rameswaram, Tamil Nadu",
    duration:    "1 Day",
    price:       2800,
    image:       "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Ramanathaswamy_Temple_Rameswaram.jpg/640px-Ramanathaswamy_Temple_Rameswaram.jpg",
    description: "Ramanathaswamy Temple, Agni Theertham, Dhanushkodi Beach.",
  },
  {
    _id:         "p3",
    title:       "Kanyakumari Tour Package",
    destination: "Kanyakumari, Tamil Nadu",
    duration:    "1 Day",
    price:       3000,
    image:       "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Vivekananda_Rock_Memorial.jpg/640px-Vivekananda_Rock_Memorial.jpg",
    description: "Vivekananda Rock Memorial, Thiruvalluvar Statue, Sunset View Point.",
  },
  {
    _id:         "p4",
    title:       "Trivandrum Tour Package",
    destination: "Trivandrum, Kerala",
    duration:    "2 Days / 1 Night",
    price:       5500,
    image:       "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Kovalam_beach.jpg/640px-Kovalam_beach.jpg",
    description: "Padmanabhaswamy Temple, Kovalam Beach.",
  },
  {
    _id:         "p5",
    title:       "Alleppey Tour Package",
    destination: "Alleppey, Kerala",
    duration:    "2 Days / 1 Night",
    price:       7500,
    image:       "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Kerala_backwaters.jpg/640px-Kerala_backwaters.jpg",
    description: "Alleppey Backwaters, Houseboat Cruise.",
  },
  {
    _id:         "p6",
    title:       "Cochin Tour Package",
    destination: "Cochin, Kerala",
    duration:    "2 Days / 1 Night",
    price:       6000,
    image:       "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Fort_Kochi_beach.jpg/640px-Fort_Kochi_beach.jpg",
    description: "Fort Kochi Beach, Chinese Fishing Nets.",
  },
  {
    _id:         "p7",
    title:       "Munnar Tour Package",
    destination: "Munnar, Kerala",
    duration:    "2 Days / 1 Night",
    price:       6500,
    image:       "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Munnar_tea_plantation.jpg/640px-Munnar_tea_plantation.jpg",
    description: "Tea Museum, Eravikulam National Park.",
  },
  {
    _id:         "p8",
    title:       "Kodaikanal Tour Package",
    destination: "Kodaikanal, Tamil Nadu",
    duration:    "2 Days / 1 Night",
    price:       5000,
    image:       "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Kodaikanal_Lake.jpg/640px-Kodaikanal_Lake.jpg",
    description: "Kodaikanal Lake, Coaker's Walk.",
  },
  {
    _id:         "p9",
    title:       "Thekkady Tour Package",
    destination: "Thekkady, Kerala",
    duration:    "2 Days / 1 Night",
    price:       5800,
    image:       "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Periyar_lake.jpg/640px-Periyar_lake.jpg",
    description: "Periyar Wildlife Sanctuary.",
  },
  {
    _id:         "p10",
    title:       "Ooty Tour Package",
    destination: "Ooty, Tamil Nadu",
    duration:    "2 Days / 1 Night",
    price:       4800,
    image:       "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Ooty_Lake.jpg/640px-Ooty_Lake.jpg",
    description: "Ooty Lake, Botanical Garden.",
  },
  {
    _id:         "p11",
    title:       "Coimbatore Tour Package",
    destination: "Coimbatore, Tamil Nadu",
    duration:    "1 Day",
    price:       2200,
    image:       "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Isha_Yoga_Center.jpg/640px-Isha_Yoga_Center.jpg",
    description: "Isha Yoga Center, Marudamalai Temple.",
  },
];

// ── Static vehicle data (from OurVehicles.jsx) ────────────────────────────────
const vehicles = [
  {
    _id:         "v1",
    name:        "Mini",
    type:        "Hatchback",
    seats:       4,
    pricePerDay: 1300,
    image:       "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80",
    description: "Compact and fuel-efficient, perfect for city transfers and short trips.",
    rentPerDay:  "₹1300/-",
    fuelCharge:  "₹8/km",
    driverBetta: "₹200/-",
  },
  {
    _id:         "v2",
    name:        "Sedan",
    type:        "Sedan",
    seats:       4,
    pricePerDay: 1500,
    image:       "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80",
    description: "Comfortable sedan ideal for family trips and outstation travel.",
    rentPerDay:  "₹1500/-",
    fuelCharge:  "₹9/km",
    driverBetta: "₹200/-",
  },
  {
    _id:         "v3",
    name:        "Etios",
    type:        "Sedan",
    seats:       4,
    pricePerDay: 1500,
    image:       "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80",
    description: "Reliable and spacious sedan for comfortable long-distance travel.",
    rentPerDay:  "₹1500/-",
    fuelCharge:  "₹9/km",
    driverBetta: "₹200/-",
  },
  {
    _id:         "v4",
    name:        "SUV (Tavera A/C)",
    type:        "SUV",
    seats:       7,
    pricePerDay: 2000,
    image:       "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80",
    description: "Spacious SUV with AC, perfect for group travel and family tours.",
    rentPerDay:  "₹2000/-",
    fuelCharge:  "₹11/km",
    driverBetta: "₹300/-",
  },
  {
    _id:         "v5",
    name:        "SUV (Ertiga / Rumion)",
    type:        "SUV",
    seats:       7,
    pricePerDay: 1900,
    image:       "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80",
    description: "Modern SUV with great comfort for both city and highway drives.",
    rentPerDay:  "₹1900/-",
    fuelCharge:  "₹11/km",
    driverBetta: "₹300/-",
  },
  {
    _id:         "v6",
    name:        "SUV (Innova A/C)",
    type:        "SUV",
    seats:       7,
    pricePerDay: 2200,
    image:       "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80",
    description: "Toyota Innova — the most trusted vehicle for South India tours.",
    rentPerDay:  "₹2200/-",
    fuelCharge:  "₹12/km",
    driverBetta: "₹300/-",
  },
  {
    _id:         "v7",
    name:        "SUV (Innova Crysta)",
    type:        "Premium SUV",
    seats:       7,
    pricePerDay: 2500,
    image:       "https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=600&q=80",
    description: "Premium Innova Crysta with superior comfort for VIP travel.",
    rentPerDay:  "₹2500/-",
    fuelCharge:  "₹16/km",
    driverBetta: "₹400/-",
  },
  {
    _id:         "v8",
    name:        "Tempo",
    type:        "Tempo Traveller",
    seats:       12,
    pricePerDay: 2600,
    image:       "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&q=80",
    description: "12-seater tempo traveller ideal for group tours with push-back seats.",
    rentPerDay:  "₹2600/-",
    fuelCharge:  "₹16/km",
    driverBetta: "₹500/-",
  },
  {
    _id:         "v9",
    name:        "21 Seater Coach A/C",
    type:        "Coach",
    seats:       21,
    pricePerDay: 5500,
    image:       "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80",
    description: "AC coach for large group travel — corporate tours and pilgrimages.",
    rentPerDay:  "₹5500/-",
    fuelCharge:  "₹25/km",
    driverBetta: "₹600/-",
  },
  {
    _id:         "v10",
    name:        "21 Seater Coach Non A/C",
    type:        "Coach",
    seats:       21,
    pricePerDay: 3600,
    image:       "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80",
    description: "Non-AC coach at affordable rates for large group travel.",
    rentPerDay:  "₹3600/-",
    fuelCharge:  "₹17/km",
    driverBetta: "₹500/-",
  },
];

// ── GET /api/packages ─────────────────────────────────────────────────────────
router.get("/packages", (req, res) => {
  res.json(packages);
});

// ── GET /api/packages/:id ─────────────────────────────────────────────────────
router.get("/packages/:id", (req, res) => {
  const pkg = packages.find((p) => p._id === req.params.id);
  if (!pkg) return res.status(404).json({ message: "Package not found." });
  res.json(pkg);
});

// ── GET /api/vehicles ─────────────────────────────────────────────────────────
router.get("/vehicles", (req, res) => {
  res.json(vehicles);
});

// ── GET /api/vehicles/:id ─────────────────────────────────────────────────────
router.get("/vehicles/:id", (req, res) => {
  const v = vehicles.find((v) => v._id === req.params.id);
  if (!v) return res.status(404).json({ message: "Vehicle not found." });
  res.json(v);
});

module.exports = router;