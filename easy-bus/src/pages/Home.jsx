import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Radio, Smartphone, AlertCircle } from 'lucide-react';
import { getStore } from '../utils/storage';

export default function Home() {
  const navigate = useNavigate();
  const routes = getStore("eb_routes", []);
  const allTrips = getStore("eb_trips", []);

  const [from, setFrom] = useState("Kopargaon");
  const [to, setTo] = useState("Kolpewadi");
  const [searchedBuses, setSearchedBuses] = useState(allTrips);
  const [hasSearched, setHasSearched] = useState(true);

  const handleSearch = (e) => {
    e.preventDefault();
    const matches = allTrips.filter(t => t.from === from && t.to === to);
    setSearchedBuses(matches);
    setHasSearched(true);
  };

  const cities = Array.from(new Set([...routes.map(r => r.from), ...routes.map(r => r.to)]));

  return (
    <div className="min-w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto px-4 py-8 w-full">
        {/* Hero */}
        <div className="text-center mb-8">
          <span className="inline-block bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full font-semibold mb-3 border border-emerald-500/20">
            College Innovation Prototype
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
            Know Your Bus <span className="text-emerald-400">Before You Wait</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Find active buses on your route, check estimated arrival time, and track bus availability with Easy Bus.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label className="text-xs text-slate-400 font-semibold mb-1 block">FROM</label>
            <select value={from} onChange={e => setFrom(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
              {cities.map(c => <option key={`from_${c}`} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs text-slate-400 font-semibold mb-1 block">TO</label>
            <select value={to} onChange={e => setTo(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
              {cities.map(c => <option key={`to_${c}`} value={c}>{c}</option>)}
            </select>
          </div>
          <button type="submit" className="md:self-end bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 transition">
            <Search className="w-4 h-4" /> Find Buses
          </button>
        </form>

        {/* Results */}
        {hasSearched && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{searchedBuses.length} Active Buses Found</h2>
              <span className="text-xs text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Demonstration Data
              </span>
            </div>

            {searchedBuses.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
                No active buses currently running on this route.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchedBuses.map((bus) => (
                  <div key={bus.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between shadow-lg">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-lg font-black text-white">{bus.busNumber}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bus.tripStatus === 'ON_TIME' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                          {bus.tripStatus}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mb-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{bus.from} &rarr; {bus.to}</span>
                      </div>
                      <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-2.5 my-3 flex justify-between items-center text-xs">
                        <span className="text-slate-400">Current: <b className="text-slate-200">{bus.currentLocation}</b></span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> ETA: {bus.etaMinutes}m
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-[11px] text-slate-500 mb-3">
                        <span className="flex items-center gap-1">
                          {bus.trackingSource === 'BUS_GPS' ? <Radio className="w-3.5 h-3.5 text-blue-400" /> : <Smartphone className="w-3.5 h-3.5 text-amber-400" />}
                          {bus.trackingSource === 'BUS_GPS' ? 'Vehicle GPS' : 'Driver Mobile GPS'}
                        </span>
                        <span>{bus.lastUpdated}</span>
                      </div>
                      <button onClick={() => navigate(`/bus/${bus.id}`)} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-xl text-xs transition">
                        View Live Status
                      </button>
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