import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Radio, Smartphone, AlertCircle, ExternalLink, Navigation } from 'lucide-react';
import { getStore } from '../utils/storage';

export default function Home() {
  const navigate = useNavigate();
  const [allTrips, setAllTrips] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [from, setFrom] = useState("Kopargaon");
  const [to, setTo] = useState("Sangamner");
  const [searchedBuses, setSearchedBuses] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Storage se fresh active trips fetch karne ka robust function
  const loadFreshData = (selectedFrom = from, selectedTo = to) => {
    const rawTrips = getStore("eb_trips", []);
    const activeOnly = rawTrips.filter(t => t.tripStatus !== 'COMPLETED');
    const loadedRoutes = getStore("eb_routes", []);

    setAllTrips(activeOnly);
    setRoutes(loadedRoutes);

    // Case insensitive aur trim-safe match
    const cleanFrom = selectedFrom.trim().toLowerCase();
    const cleanTo = selectedTo.trim().toLowerCase();

    const matches = activeOnly.filter(
      t => t.from?.trim().toLowerCase() === cleanFrom && t.to?.trim().toLowerCase() === cleanTo
    );

    setSearchedBuses(matches);
    setHasSearched(true);
  };

  useEffect(() => {
    loadFreshData(from, to);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadFreshData(from, to);
  };

  // Sare unique cities collect karo (from static routes + active trips)
  const cities = Array.from(new Set([
    "Kopargaon", "Sangamner", "Kolpewadi", "Shirdi", "Rahata", "Yeola",
    ...routes.map(r => r.from?.trim()),
    ...routes.map(r => r.to?.trim()),
    ...allTrips.map(t => t.from?.trim()),
    ...allTrips.map(t => t.to?.trim())
  ].filter(Boolean)));

  return (
    <div className="min-w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full font-semibold mb-3 border border-emerald-500/20">
            College Innovation Prototype
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
            Know Your Bus <span className="text-emerald-400">Before You Wait</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Route-First Discovery: Get operating bus numbers, check official MSRTC hardware tracking, or view driver live fallback GPS.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label className="text-xs text-slate-400 font-semibold mb-1 block">FROM</label>
            <select 
              value={from} 
              onChange={e => {
                setFrom(e.target.value);
                loadFreshData(e.target.value, to);
              }} 
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              {cities.map(c => <option key={`from_${c}`} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs text-slate-400 font-semibold mb-1 block">TO</label>
            <select 
              value={to} 
              onChange={e => {
                setTo(e.target.value);
                loadFreshData(from, e.target.value);
              }} 
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              {cities.map(c => <option key={`to_${c}`} value={c}>{c}</option>)}
            </select>
          </div>
          <button type="submit" className="md:self-end bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer">
            <Search className="w-4 h-4" /> Find Buses
          </button>
        </form>

        {/* Results */}
        {hasSearched && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{searchedBuses.length} Bus{searchedBuses.length === 1 ? '' : 'es'} Operating on Route</h2>
              <span className="text-xs text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Demonstration Data
              </span>
            </div>

            {searchedBuses.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
                No active buses found between <b className="text-white">{from}</b> and <b className="text-white">{to}</b>.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchedBuses.map((bus) => (
                  <div key={bus.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-xl font-black text-white tracking-wider">{bus.busNumber}</div>
                          {bus.driverName && <p className="text-[11px] text-slate-400">Driver: {bus.driverName}</p>}
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${bus.trackingSource === 'BUS_GPS' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                          {bus.trackingSource === 'BUS_GPS' ? 'OFFICIAL BUS GPS' : 'PHONE FALLBACK GPS'}
                        </span>
                      </div>

                      <div className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{bus.from} &rarr; {bus.to}</span>
                      </div>

                      <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 my-2 text-xs flex justify-between items-center">
                        <span className="text-slate-400">Current: <b className="text-slate-200">{bus.currentLocation}</b></span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> ETA: {bus.etaMinutes}m
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                      {bus.trackingSource === 'BUS_GPS' ? (
                        <div>
                          <div className="text-[11px] text-blue-300/80 bg-blue-950/40 border border-blue-900/50 p-2.5 rounded-xl mb-2 flex items-start gap-2">
                            <Radio className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                            <span>This bus has hardware GPS active. Open official MSRTC app and search bus <b>{bus.busNumber}</b>.</span>
                          </div>
                          <button 
                            onClick={() => alert(`Official MSRTC Demo:\nSearch Bus Number: ${bus.busNumber} on Aapli ST / MSRTC official app.`)}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Check on MSRTC App (Use {bus.busNumber})
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="text-[11px] text-emerald-300/80 bg-emerald-950/40 border border-emerald-900/50 p-2.5 rounded-xl mb-2 flex items-start gap-2">
                            <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>Hardware GPS down. Tracking via Driver's live smartphone GPS broadcast.</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <a 
                              href={`https://www.google.com/maps?q=${bus.liveCoordinates?.lat || 19.8876},${bus.liveCoordinates?.lng || 74.4789}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 text-center"
                            >
                              <Navigation className="w-3.5 h-3.5" /> Live Map Link
                            </a>

                            <button 
                              onClick={() => navigate(`/bus/${bus.id}`)} 
                              className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-xl text-xs transition"
                            >
                              Timeline View
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}