import { Link, useNavigate } from 'react-router-dom';
import { Bus, ShieldCheck, User } from 'lucide-react';
import { getStore, setStore } from '../utils/storage';

export default function Navbar() {
  const navigate = useNavigate();
  const driver = getStore("eb_active_driver", null);
  const isAdmin = getStore("eb_admin_auth", false);

  const handleLogout = () => {
    setStore("eb_active_driver", null);
    setStore("eb_admin_auth", false);
    navigate("/");
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-emerald-400">
          <Bus className="w-6 h-6" />
          <span>Easy Bus</span>
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="hover:text-emerald-400">Home</Link>
          <Link to="/how-it-works" className="hover:text-emerald-400 hidden sm:inline">How It Works</Link>
          
          {driver ? (
            <div className="flex items-center gap-2">
              <Link to="/driver/dashboard" className="bg-emerald-600 px-3 py-1.5 rounded-lg flex items-center gap-1">
                <User className="w-4 h-4" /> Driver Panel
              </Link>
              <button onClick={handleLogout} className="text-rose-400 ml-1">Logout</button>
            </div>
          ) : isAdmin ? (
            <div className="flex items-center gap-2">
              <Link to="/admin/dashboard" className="bg-indigo-600 px-3 py-1.5 rounded-lg flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Admin Panel
              </Link>
              <button onClick={handleLogout} className="text-rose-400 ml-1">Logout</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/driver/login" className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-700">Driver</Link>
              <Link to="/admin/login" className="bg-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-500">Admin</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}