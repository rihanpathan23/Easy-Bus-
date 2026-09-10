import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Smartphone, Play, StopCircle, UserCheck } from 'lucide-react';
import { getStore, setStore } from '../utils/storage';

export default function DriverDashboard() {
  const navigate = useNavigate();
  const driver = getStore("eb_active_driver", null);
  const trips = getStore("eb_trips", []);
  const activeTrip = trips.find(t => t.driverId === driver?.id && t.tripStatus !== 'COMPLETED');

  const [busNumber, setBusNumber] = useState('MH-14-BT-9999');
  const [from, setFrom] = useState('Sangamner');
  const [to, setTo] = useState('Kopargaon');
  const [trackingSource, setTrackingSource] = useState('BUS_GPS');
  const [geoCoords, setGeoCoords] = useState(null);

  const requestPhoneGps = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setGeoCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => alert("Location permission required for driver smartphone fallback.")
      );
    }
  };

  const handleStartTrip = (e) => {
    e.preventDefault();
    if (!busNumber.trim() || !from.trim() || !to.trim()) {
      alert("Kripya saari details bharein!");
      return;
    }
    if (trackingSource === 'SMARTPHONE_GPS' && !geoCoords) {
      alert("Please enable smartphone GPS first!");
      return;
    }

    // Nayi trip object
    const newTrip = {
      id: `trip_${Date.now()}`,
      driverId: driver?.id,
      driverName: driver?.name || "Ramesh Patil",
      busNumber: busNumber.toUpperCase(),
      from: from.trim(),
      to: to.trim(),
      currentLocation: geoCoords ? `Lat: ${geoCoords.lat.toFixed(2)}, Lng: ${geoCoords.lng.toFixed(2)}` : `${from} Stand`,
      etaMinutes: 12,
      tripStatus: "ON_TIME",
      trackingSource,
      lastUpdated: "Just now"
    };

    // Global routes update karo agar naya route ho
    const routes = getStore("eb_routes", []);
    const routeExists = routes.some(r => r.from.toLowerCase() === from.toLowerCase() && r.to.toLowerCase() === to.toLowerCase());
    if (!routeExists) {
      setStore("eb_routes", [...routes, { id: `${Date.now()}`, from: from.trim(), to: to.trim(), stops: [from, to] }]);
    }

    // Trips list update
    setStore("eb_trips", [newTrip, ...trips]);
    window.location.reload();
  };

  const handleEndTrip = () => {
    const updated = trips.map(t => t.id === activeTrip.id ? { ...t, tripStatus: 'COMPLETED' } : t);
    setStore("eb_trips", updated);
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-8 text-white">
      {/* Driver Info Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 flex justify-between items-center shadow-lg">
        <div>
          <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1 mb-1">
            <UserCheck className="w-4 h-4" /> Driver Portal
          </span>
          <h1 className="text-2xl font-black text-white">{driver?.name || "Ramesh Patil"}</h1>
          <p className="text-xs text-slate-400">Driver ID: {driver?.driverId || "DRV101"} | Phone: {driver?.phone || "9876543210"}</p>
        </div>
        <button onClick={() => navigate('/')} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl text-slate-300">
          Go To Passenger Search
        </button>
      </div>

      {activeTrip ? (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            TRIP IS CURRENTLY LIVE
          </span>
          <h2 className="text-3xl font-black mt-3 mb-1 text-white">{activeTrip.busNumber}</h2>
          <p className="text-sm font-semibold text-slate-300 mb-4">{activeTrip.from} &rarr; {activeTrip.to}</p>
          <div className="text-xs text-slate-300 bg-slate-950 p-4 rounded-xl mb-6 border border-slate-800 flex justify-between">
            <span>Tracking Mode: <b className="text-emerald-400">{activeTrip.trackingSource}</b></span>
            <span>Current Stop: <b className="text-white">{activeTrip.currentLocation}</b></span>
          </div>
          <button onClick={handleEndTrip} className="w-full bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition">
            <StopCircle className="w-5 h-5" /> End Trip (Remove from Passenger Search)
          </button>
        </div>
      ) : (
        <form onSubmit={handleStartTrip} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Assign Route & Bus Number</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">FROM (Starting Point)</label>
              <input 
                required
                value={from} 
                onChange={e => setFrom(e.target.value)} 
                placeholder="e.g. Sangamner"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" 
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">TO (Destination)</label>
              <input 
                required
                value={to} 
                onChange={e => setTo(e.target.value)} 
                placeholder="e.g. Kopargaon"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" 
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">BUS NUMBER</label>
            <input 
              required
              value={busNumber} 
              onChange={e => setBusNumber(e.target.value)} 
              placeholder="e.g. MH-14-BT-9999"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono tracking-wider" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-semibold block">Select Tracking Source</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                type="button" 
                onClick={() => setTrackingSource('BUS_GPS')} 
                className={`p-4 rounded-xl border text-left flex flex-col gap-1 transition ${trackingSource === 'BUS_GPS' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-950'}`}
              >
                <Radio className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-bold text-white">Vehicle GPS</span>
                <span className="text-[11px] text-slate-400">Bus hardware tracker online</span>
              </button>
              <button 
                type="button" 
                onClick={() => setTrackingSource('SMARTPHONE_GPS')} 
                className={`p-4 rounded-xl border text-left flex flex-col gap-1 transition ${trackingSource === 'SMARTPHONE_GPS' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-950'}`}
              >
                <Smartphone className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-bold text-white">Driver Smartphone GPS</span>
                <span className="text-[11px] text-slate-400">Fallback when bus GPS fails</span>
              </button>
            </div>
          </div>

          {trackingSource === 'SMARTPHONE_GPS' && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <button type="button" onClick={requestPhoneGps} className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-2 rounded-lg font-bold">
                {geoCoords ? "✓ Smartphone GPS Connected" : "Grant Smartphone Location Permission"}
              </button>
              {geoCoords && <span className="text-xs text-slate-400 font-mono">Lat: {geoCoords.lat.toFixed(2)}, Lng: {geoCoords.lng.toFixed(2)}</span>}
            </div>
          )}

          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition">
            <Play className="w-4 h-4 fill-current" /> Start Trip & Publish to Passengers
          </button>
        </form>
      )}
    </div>
  );
}