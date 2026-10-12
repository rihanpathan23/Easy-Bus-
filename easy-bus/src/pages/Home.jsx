import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Clock, Radio, Smartphone, ExternalLink, Navigation, CheckCircle, AlertTriangle } from 'lucide-react';
import { getStore, setStore } from '../utils/storage';
import { initialTrips, initialRoutes } from '../data/mockData';

export default function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const initFrom = searchParams.get('from') || "Kopargaon";
  const initTo = searchParams.get('to') || "Kolpewadi";

  const [routes, setRoutes] = useState([]);
  const [from, setFrom] = useState(initFrom);
  const [to, setTo] = useState(initTo);
  const [searchedBuses, setSearchedBuses] = useState([]);
  const [copiedBus, setCopiedBus] = useState("");

  const loadData = (selectedFrom = from, selectedTo = to) => {
    let storedTrips = getStore("eb_trips", []);
    
    // STRICT CACHE CLEANUP LOGIC:
    // Hum sirf unhi buses ko bachaenge jo real mein driver ne login karke add ki hain (ID contains '_drv_')
    // Baaki saari purani kachra/mock trips ko delete karke fresh mock data se replace kar denge
    const realDriverTrips = storedTrips.filter(t => t.id && t.id.includes("_drv_"));
    
    // Fresh mock data aur real driver trips ko merge karo
    storedTrips = [...initialTrips, ...realDriverTrips];
    setStore("eb_trips", storedTrips);
    
    let storedRoutes = getStore("eb_routes", []);
    if (storedRoutes.length < initialRoutes.length) {
      setStore("eb_routes", initialRoutes);
      storedRoutes = initialRoutes;
    }

    setRoutes(storedRoutes);

    const activeTrips = storedTrips.filter(t => t.tripStatus !== 'COMPLETED');
    const cleanFrom = selectedFrom.trim().toLowerCase();
    const cleanTo = selectedTo.trim().toLowerCase();

    const matches = activeTrips.filter(
      b => b.from?.trim().toLowerCase() === cleanFrom && b.to?.trim().toLowerCase() === cleanTo
    );
    setSearchedBuses(matches);
  };

  useEffect(() => {
    loadData(initFrom, initTo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initFrom, initTo]);

  const handleSearch = (e) => {
    e.preventDefault();
    window.history.pushState({}, '', `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
    loadData(from, to);
  };

  const handleOpenMsrtcApp = (busNumber) => {
    navigator.clipboard.writeText(busNumber);
    setCopiedBus(busNumber);
    setTimeout(() => setCopiedBus(""), 5000);

    const playStoreUrl = "https://play.google.com/store/apps/details?id=com.app.commuter&hl=en_IN";
    const appSchemeUrl = "msrtc://track?bus=" + encodeURIComponent(busNumber);

    const now = Date.now();
    window.location.href = appSchemeUrl;

    setTimeout(() => {
      if (Date.now() - now < 2000) {
        window.open(playStoreUrl, "_blank");
      }
    }, 1000);
  };

  const routeList = ["Kopargaon", "Kolpewadi", "Rahata", "Yeola", "Shirdi", "Sangamner", "Shrirampur", "Manmad", "Ahilyanagar", "Nashik", "Pune"];
  const cities = Array.from(new Set([
    ...routeList,
    ...routes.map(r => r.from?.trim()),
    ...routes.map(r => r.to?.trim())
  ].filter(Boolean)));

  return (
    <div className="min-w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full font-semibold mb-3 border border-emerald-500/20">
            Real-Time Public Transport Status
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
            Know Your Bus <span className="text-emerald-400">Before You Wait</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Route-First Discovery: Locate operating buses on your route, access official MSRTC hardware tracking, or view driver live fallback GPS.
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
                loadData(e.target.value, to);
                window.history.pushState({}, '', `?from=${encodeURIComponent(e.target.value)}&to=${encodeURIComponent(to)}`);
              }} 
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
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
                loadData(from, e.target.value);
                window.history.pushState({}, '', `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(e.target.value)}`);
              }} 
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              {cities.map(c => <option key={`to_${c}`} value={c}>{c}</option>)}
            </select>
          </div>
          <button type="submit" className="md:self-end bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer">
            <Search className="w-4 h-4" /> Find Buses
          </button>
        </form>

        {copiedBus && (
          <div className="mb-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl text-xs flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" /> Bus number <b>{copiedBus}</b> copied! Redirecting to MSRTC Aapli ST...
            </span>
          </div>
        )}

        {/* Results */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{searchedBuses.length} Active Bus{searchedBuses.length === 1 ? '' : 'es'} on Route</h2>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {from} &rarr; {to}
            </span>
          </div>

          {searchedBuses.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center text-slate-400">
              <AlertTriangle className="w-8 h-8 text-amber-500/50 mb-3" />
              <p>No active buses currently found between <b className="text-white">{from}</b> and <b className="text-white">{to}</b>.</p>
              <p className="text-xs mt-2 text-slate-500">Awaiting dispatch update.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchedBuses.map((bus) => (
                <div key={bus.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
                  <div>
                    {/* Top Bar */}
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-xl font-black text-white tracking-wider">{bus.busNumber}</div>
                        {bus.driverName && <p className="text-[11px] text-slate-400">Driver: {bus.driverName}</p>}
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${bus.trackingSource === 'BUS_GPS' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                        {bus.trackingSource === 'BUS_GPS' ? 'EXISTING BUS GPS' : 'DRIVER PHONE GPS'}
                      </span>
                    </div>

                    {/* Route Info */}
                    <div className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{bus.from} &rarr; {bus.to}</span>
                      <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded ${
                        bus.tripStatus === 'ON_TIME' ? 'bg-green-500/10 text-green-400' :
                        bus.tripStatus === 'DELAYED' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {bus.tripStatus.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Current Position */}
                    <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 my-2 text-xs flex justify-between items-center">
                      <span className="text-slate-400">Status: <b className="text-slate-200">{bus.currentLocation}</b></span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> ETA: {bus.etaMinutes}m
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                    {bus.trackingSource === 'BUS_GPS' ? (
                      <div>
                        <div className="text-[11px] text-blue-300/90 bg-blue-950/40 border border-blue-900/50 p-2.5 rounded-xl mb-2 flex items-start gap-2">
                          <Radio className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                          <span>Vehicle GPS Active: Last pinged {bus.lastUpdated}</span>
                        </div>
                        <button 
                          onClick={() => handleOpenMsrtcApp(bus.busNumber)}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Check on MSRTC Aapli ST ({bus.busNumber})
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="text-[11px] text-emerald-300/90 bg-emerald-950/40 border border-emerald-900/50 p-2.5 rounded-xl mb-2 flex items-start gap-2">
                          <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>Driver Phone GPS Active: Location updated {bus.lastUpdated}.</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <a 
                            href={`https://www.google.com/maps?q=${bus.liveCoordinates?.lat || 19.8876},${bus.liveCoordinates?.lng || 74.4789}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 text-center"
                          >
                            <Navigation className="w-3.5 h-3.5" /> Live Map
                          </a>

                          <button 
                            onClick={() => navigate(`/bus/${bus.id}`)} 
                            className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-xl text-xs transition"
                          >
                            View Timeline
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
      </div>
    </div>
  );
}