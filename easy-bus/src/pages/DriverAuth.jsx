import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStore, setStore } from '../utils/storage';

export default function DriverAuth() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const drivers = getStore("eb_drivers", []);

    if (isRegister) {
      const newDriver = {
        id: `drv_${Date.now()}`,
        name: formData.name,
        driverId: `DRV${Math.floor(100 + Math.random() * 900)}`,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        status: "pending"
      };
      setStore("eb_drivers", [...drivers, newDriver]);
      setMsg("Registration submitted! Waiting for Admin Approval.");
      setIsRegister(false);
    } else {
      const found = drivers.find(d => d.email === formData.email && d.password === formData.password);
      if (!found) {
        setMsg("Invalid credentials.");
      } else if (found.status === 'pending') {
        setMsg("Your account is awaiting administrator approval.");
      } else if (found.status === 'rejected') {
        setMsg("Your driver request was rejected. Contact Admin.");
      } else {
        setStore("eb_active_driver", found);
        navigate("/driver/dashboard");
      }
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-black text-white text-center mb-2">
          {isRegister ? "Driver Registration" : "Driver Login"}
        </h2>
        <p className="text-xs text-slate-400 text-center mb-6">Easy Bus Hybrid Operations</p>

        {msg && <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs p-3 rounded-lg mb-4 text-center">{msg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <input required placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
              <input required placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </>
          )}
          <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
          <input required type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />

          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition">
            {isRegister ? "Request Driver Access" : "Login"}
          </button>
        </form>

        <button onClick={() => { setIsRegister(!isRegister); setMsg(''); }} className="w-full text-center text-xs text-slate-400 hover:text-white mt-4">
          {isRegister ? "Already registered? Login here" : "Need access? Register here"}
        </button>
      </div>
    </div>
  );
}