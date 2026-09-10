import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { initStorage, getStore } from './utils/storage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BusLiveStatus from './pages/BusLiveStatus';
import HowItWorks from './pages/HowItWorks';
import DriverAuth from './pages/DriverAuth';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Simple Prototype Auth Guards
const DriverGuard = ({ children }) => {
  const driver = getStore("eb_active_driver", null);
  return driver ? children : <Navigate to="/driver/login" />;
};

const AdminGuard = ({ children }) => {
  const isAdmin = getStore("eb_admin_auth", false);
  return isAdmin ? children : <Navigate to="/admin/login" />;
};

export default function App() {
  useEffect(() => {
    initStorage();
  }, []);

  return (
    <BrowserRouter>
      <div className="bg-slate-950 min-h-screen flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/bus/:id" element={<BusLiveStatus />} />
            
            {/* Driver Routes */}
            <Route path="/driver/login" element={<DriverAuth />} />
            <Route path="/driver/dashboard" element={<DriverGuard><DriverDashboard /></DriverGuard>} />

            {/* Admin Prototype Routes */}
            <Route path="/admin/login" element={<AdminLoginScreen />} />
            <Route path="/admin/dashboard" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

// Inline Minimal Admin Login for Zero-Lag Prototype
function AdminLoginScreen() {
  const handleAdmin = (e) => {
    e.preventDefault();
    localStorage.setItem("eb_admin_auth", JSON.stringify(true));
    window.location.href = "/admin/dashboard";
  };
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <form onSubmit={handleAdmin} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-sm text-center">
        <h2 className="text-xl font-bold text-white mb-2">Admin Demo Login</h2>
        <p className="text-xs text-slate-400 mb-6">Demo Email: admin@easybus.demo</p>
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl text-sm">
          Quick Access (Admin Portal)
        </button>
      </form>
    </div>
  );
}