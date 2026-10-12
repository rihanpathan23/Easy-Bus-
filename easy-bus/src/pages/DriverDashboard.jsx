import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Smartphone, Play, StopCircle, UserCheck } from 'lucide-react';
import { getStore, setStore } from '../utils/storage';
import { availableBusNumbers, initialRoutes } from '../data/mockData';

export default function DriverDashboard() {
  const navigate = useNavigate();
  const driver = getStore("eb_active_driver", null);
  const trips = getStore("eb_trips", []);
  
  // Find current driver's active trip
  const activeTrip = trips.find(t => t.driverId === driver?.id && t.tripStatus !== 'COMPLETED');

  const [busNumber, setBusNumber] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [trackingSource, setTrackingSource] = useState('BUS_GPS');
  const [geoCoords, setGeoCoords] = useState(null);

  const requestPhoneGps = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setGeoCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => alert("Location permission is required for Smartphone GPS Tracking.")
      );
    } else {
      setGeoCoords({ lat: 19.8876, lng: 74.4789 });
    }
  };

  const handleStartTrip = (e) => {
    e.preventDefault();
    if (!busNumber.trim() || !from.trim() || !to.trim()) {
      alert("Please fill in the route and bus number.");
      return;
    }

    const newTrip = {
      id: `trip_${Date.now()}_${driver?.id}`,
      driverId: driver?.id,
      driverName: driver?.name || "Driver",
      busNumber: busNumber.trim().toUpperCase(),
      from: from.trim(),
      to: to.trim(),
      currentLocation: geoCoords ? `En route to ${to.trim()}` : `${from.trim()} Bus Stand`,
      liveCoordinates: geoCoords || { lat: 19.8876, lng: 74.4789 },
      etaMinutes: 15,
      tripStatus: "ON_TIME",
      trackingSource,
      lastUpdated: "Just now"
    };

    // Global trips array mein naya trip push karo (Purane trips safe rahenge)
    setStore("eb_trips", [newTrip, ...trips]);
    
    // Save new route if it doesn't exist
    const routes = getStore("eb_routes", initialRoutes);
    const routeExists = routes.some(r => r.from.toLowerCase() === from.toLowerCase() && r.to.toLowerCase() === to.toLowerCase());
    if (!routeExists) {
      setStore("eb_routes", [...routes, { id: `${Date.now()}`, from: from.trim(), to: to.trim(), stops: [from, to] }]);
    }

    window.location.reload();
  };

  const handleEndTrip = () => {
    const updated = trips.map(t => t.id === activeTrip.id ? { ...t, tripStatus: 'COMPLETED' } : t);
    setStore("eb_trips", updated);
    window.location.reload();
  };

  // Generate unique cities for the datalist dropdown
  const storedRoutes = getStore("eb_routes", initialRoutes);
  const cities = Array.from(new Set([
    ...storedRoutes.map(r => r.from),
    ...storedRoutes.map(r => r.to)
  ]));

  return (
    <div className="max-w-4xl mx-auto p-4 py-8 text-white">
      {/* Driver Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 flex justify-between items-center shadow-lg">
        <div>
          <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1 mb-1">
            <UserCheck className="w-4 h-4" /> Operations Portal
          </span>
          <h1 className="text-2xl font-black text-white">{driver?.name || "Driver Panel"}</h1>
          <p className="text-xs text-slate-400">ID: {driver?.driverId || "DRV101"} | Ph: {driver?.phone || "9876543210"}</p>
        </div>
        <button onClick={() => navigate('/')} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl text-slate-300">
          Passenger View
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
            <span>Tracking: <b className="text-emerald-400">{activeTrip.trackingSource === 'BUS_GPS' ? 'Official Vehicle GPS' : 'Smartphone GPS Broadcast'}</b></span>
            <span>Location: <b className="text-white">{activeTrip.currentLocation}</b></span>
          </div>

          <button onClick={handleEndTrip} className="w-full bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition">
            <StopCircle className="w-5 h-5" /> End Trip (Complete Service)
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
                list="cities-list"
                value={from} 
                onChange={e => setFrom(e.target.value)} 
                placeholder="Type or select origin..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" 
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">TO (Destination)</label>
              <input 
                required
                list="cities-list"
                value={to} 
                onChange={e => setTo(e.target.value)} 
                placeholder="Type or select destination..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" 
              />
            </div>
            {/* Datalist for Cities */}
            <datalist id="cities-list">
              {cities.map(c => <option key={`city_${c}`} value={c} />)}
            </datalist>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">BUS NUMBER</label>
            <input 
              required
              list="bus-list"
              value={busNumber} 
              onChange={e => setBusNumber(e.target.value)} 
              placeholder="e.g. MH14BT4175"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono tracking-wider" 
            />
            {/* Datalist for Bus Numbers */}
            <datalist id="bus-list">
              {availableBusNumbers.map(num => <option key={`bus_${num}`} value={num} />)}
            </datalist>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-semibold block">Select Tracking Mode</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                type="button" 
                onClick={() => setTrackingSource('BUS_GPS')} 
                className={`p-4 rounded-xl border text-left flex flex-col gap-1 transition ${trackingSource === 'BUS_GPS' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-slate-950'}`}
              >
                <Radio className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-bold text-white">Vehicle GPS Connected</span>
                <span className="text-[11px] text-slate-400">Routes to official MSRTC tracking</span>
              </button>
              <button 
                type="button" 
                onClick={() => setTrackingSource('SMARTPHONE_GPS')} 
                className={`p-4 rounded-xl border text-left flex flex-col gap-1 transition ${trackingSource === 'SMARTPHONE_GPS' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-950'}`}
              >
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold text-white">Driver Phone GPS</span>
                <span className="text-[11px] text-slate-400">Direct real-time map broadcast</span>
              </button>
            </div>
          </div>

          {trackingSource === 'SMARTPHONE_GPS' && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <button type="button" onClick={requestPhoneGps} className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-2 rounded-lg font-bold">
                {geoCoords ? "✓ Phone GPS Active" : "Connect Phone Location"}
              </button>
              {geoCoords && <span className="text-xs text-slate-400 font-mono">Lat: {geoCoords.lat.toFixed(4)}, Lng: {geoCoords.lng.toFixed(4)}</span>}
            </div>
          )}

          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition">
            <Play className="w-4 h-4 fill-current" /> Publish Trip to Passengers
          </button>
        </form>
      )}
    </div>
  );
}