import { useState } from 'react';
import { Radio, Smartphone, Play, StopCircle } from 'lucide-react';
import { getStore, setStore } from '../utils/storage';

export default function DriverDashboard() {
  const driver = getStore("eb_active_driver", null);
  const trips = getStore("eb_trips", []);
  const activeTrip = trips.find(t => t.driverId === driver?.id && t.tripStatus !== 'COMPLETED');

  const [busNumber, setBusNumber] = useState('MH-14-BT-2456');
  const [from, setFrom] = useState('Kopargaon');
  const [to, setTo] = useState('Kolpewadi');
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
    if (trackingSource === 'SMARTPHONE_GPS' && !geoCoords) {
      alert("Please enable smartphone GPS first!");
      return;
    }
    const newTrip = {
      id: `trip_${Date.now()}`,
      driverId: driver.id,
      busNumber,
      from,
      to,
      currentLocation: geoCoords ? `Lat: ${geoCoords.lat.toFixed(2)}, Lng: ${geoCoords.lng.toFixed(2)}` : "Near Yesgaon",
      etaMinutes: 15,
      tripStatus: "ON_TIME",
      trackingSource,
      lastUpdated: "Just now"
    };
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
        <h1 className="text-xl font-bold">Good Morning, {driver?.name}</h1>
        <p className="text-xs text-slate-400">Driver ID: {driver?.driverId}</p>
      </div>

      {activeTrip ? (
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">TRIP ACTIVE</span>
          <h2 className="text-2xl font-black mt-3 mb-1">{activeTrip.busNumber}</h2>
          <p className="text-sm text-slate-400 mb-4">{activeTrip.from} &rarr; {activeTrip.to}</p>
          <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg mb-6">
            Tracking Source: <b className="text-white">{activeTrip.trackingSource}</b> | Location: {activeTrip.currentLocation}
          </div>
          <button onClick={handleEndTrip} className="bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl flex items-center gap-2">
            <StopCircle className="w-4 h-4" /> End Trip
          </button>
        </div>
      ) : (
        <form onSubmit={handleStartTrip} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold">Start New Trip</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400">From</label>
              <input value={from} onChange={e => setFrom(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-400">To</label>
              <input value={to} onChange={e => setTo(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400">Bus Number</label>
            <input value={busNumber} onChange={e => setBusNumber(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white" />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400">Select Tracking Fallback</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setTrackingSource('BUS_GPS')} className={`p-4 rounded-xl border text-left flex flex-col gap-1 ${trackingSource === 'BUS_GPS' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-950'}`}>
                <Radio className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-bold">Vehicle Bus GPS</span>
                <span className="text-[10px] text-slate-400">Hardware GPS active</span>
              </button>
              <button type="button" onClick={() => setTrackingSource('SMARTPHONE_GPS')} className={`p-4 rounded-xl border text-left flex flex-col gap-1 ${trackingSource === 'SMARTPHONE_GPS' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-950'}`}>
                <Smartphone className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-bold">Driver Phone GPS</span>
                <span className="text-[10px] text-slate-400">Fallback when bus GPS fails</span>
              </button>
            </div>
          </div>

          {trackingSource === 'SMARTPHONE_GPS' && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <button type="button" onClick={requestPhoneGps} className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg">
                {geoCoords ? "✓ Location Synced" : "Enable Phone Location"}
              </button>
              {geoCoords && <span className="text-xs text-slate-400 ml-3">Lat: {geoCoords.lat.toFixed(2)}, Lng: {geoCoords.lng.toFixed(2)}</span>}
            </div>
          )}

          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
            <Play className="w-4 h-4" /> Start Trip
          </button>
        </form>
      )}
    </div>
  );
}