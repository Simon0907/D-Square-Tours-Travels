import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Service";
import OurVehicles from "./pages/OurVehicles";
import TourPackages from "./pages/TourPackages";
import PackageEnquiry from "./pages/PackageEnquiry";
import FamousPackageEnquiry from "./pages/FamousPackageEnquiry";
import VechilesBooking from"./pages/VehiclesBooking";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./routes/AdminRoute";
import UserDashboard from "./pages/UserDashboard";
const App = () => {
  const location = useLocation();

  // Hide Navbar & Footer on Admin pages
  const hideLayout = location.pathname.startsWith("/admin") || location.pathname.startsWith("/dashboard");

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/ourservice" element={<Services />} />
        <Route path="/ourvehicles" element={<OurVehicles />} />
        <Route path="/packages" element={<TourPackages />} />
<Route path="/package-enquiry" element={<PackageEnquiry />} />
<Route path="/famous-package" element={<FamousPackageEnquiry />} />
<Route path="/vehiclesbooking" element={<VechilesBooking />} />


        {/* AUTH */}
        <Route path="/auth" element={<Auth />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        {/*user*/}
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
};

export default App;
