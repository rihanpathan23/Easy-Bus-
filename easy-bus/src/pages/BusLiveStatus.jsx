import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, Radio, Smartphone, Clock, MapPin } from 'lucide-react';
import { getStore } from '../utils/storage';

export default function BusLiveStatus() {
  const { id } = useParams();
  const trips = getStore("eb_trips", []);
  const bus = trips.find(t => t.id === id);

  if (!bus) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <p className="mb-4">Bus trip details not found.</p>
        <Link to="/" className="text-emerald-400 underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-xs mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Search
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-4 border-b border-slate-800">
            <div>
              <h1 className="text-2xl font-black text-white">{bus.busNumber}</h1>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {bus.from} to {bus.to}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1">
                {bus.trackingSource === 'BUS_GPS' ? <Radio className="w-3.5 h-3.5 text-blue-400" /> : <Smartphone className="w-3.5 h-3.5 text-amber-400" />}
                {bus.trackingSource === 'BUS_GPS' ? 'Bus GPS' : 'Smartphone GPS'}
              </span>
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between mb-8">
            <span className="text-sm font-semibold text-emerald-400">Estimated Arrival Time</span>
            <span className="text-lg font-black text-emerald-300 flex items-center gap-1">
              <Clock className="w-5 h-5" /> ~{bus.etaMinutes} mins
            </span>
          </div>

          {/* Timeline */}
          <h2 className="text-sm font-bold text-slate-300 mb-4">Route Progress (Simulated Stops)</h2>
          <div className="space-y-6 relative pl-6 border-l-2 border-slate-800 ml-3">
            <div className="relative">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 absolute -left-[35px] top-0 bg-slate-950 rounded-full" />
              <div className="text-sm font-bold text-slate-200">Kopargaon Bus Stand</div>
              <div className="text-xs text-slate-500">Departed - Completed</div>
            </div>
            <div className="relative">
              <div className="w-4 h-4 rounded-full bg-amber-400 absolute -left-[33px] top-0.5 animate-pulse" />
              <div className="text-sm font-bold text-amber-400">{bus.currentLocation} (Current Stop)</div>
              <div className="text-xs text-amber-400/80">Bus actively transmitting location</div>
            </div>
            <div className="relative">
              <Circle className="w-4 h-4 text-slate-600 absolute -left-[33px] top-0.5 bg-slate-950" />
              <div className="text-sm font-bold text-slate-400">Kolpewadi Phata</div>
              <div className="text-xs text-slate-600">Upcoming stop</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}