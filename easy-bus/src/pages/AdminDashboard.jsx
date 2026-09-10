import { useState } from 'react';
import { getStore, setStore } from '../utils/storage';

export default function AdminDashboard() {
  const [drivers, setDrivers] = useState(getStore("eb_drivers", []));
  const trips = getStore("eb_trips", []);

  const updateStatus = (id, newStatus) => {
    const updated = drivers.map(d => d.id === id ? { ...d, status: newStatus } : d);
    setDrivers(updated);
    setStore("eb_drivers", updated);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 py-8 text-white">
      <h1 className="text-2xl font-black mb-6">Admin Control Panel</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400">Pending Requests</span>
          <p className="text-2xl font-bold mt-1 text-amber-400">{drivers.filter(d => d.status === 'pending').length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400">Approved Drivers</span>
          <p className="text-2xl font-bold mt-1 text-emerald-400">{drivers.filter(d => d.status === 'approved').length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400">Total Trips (Logs)</span>
          <p className="text-2xl font-bold mt-1 text-blue-400">{trips.length}</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4">Driver Authorization Queue</h2>
        <div className="divide-y divide-slate-800">
          {drivers.map(d => (
            <div key={d.id} className="py-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-white">{d.name} ({d.driverId})</p>
                <p className="text-xs text-slate-400">{d.email} | {d.phone}</p>
                <span className={`inline-block text-[10px] mt-1 px-2 py-0.5 rounded font-bold ${d.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : d.status === 'rejected' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {d.status.toUpperCase()}
                </span>
              </div>
              {d.status === 'pending' && (
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(d.id, 'approved')} className="bg-emerald-600 hover:bg-emerald-500 text-xs px-3 py-1.5 rounded-lg">Approve</button>
                  <button onClick={() => updateStatus(d.id, 'rejected')} className="bg-rose-600 hover:bg-rose-500 text-xs px-3 py-1.5 rounded-lg">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
