export default function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-slate-200">
      <h1 className="text-3xl font-black mb-6 text-white text-center">How Easy Bus Works</h1>
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-emerald-400 mb-3">For Passengers</h2>
          <ul className="text-xs space-y-2 text-slate-400">
            <li>1. Select starting location and destination.</li>
            <li>2. View all currently active buses running on that route.</li>
            <li>3. Check real-time ETA, bus numbers, and current stops.</li>
            <li>4. No login or signup required.</li>
          </ul>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-blue-400 mb-3">For Drivers & System</h2>
          <ul className="text-xs space-y-2 text-slate-400">
            <li>1. Driver logs in with admin-approved credentials.</li>
            <li>2. Chooses Bus GPS if dedicated vehicle tracker exists.</li>
            <li>3. Uses Driver Smartphone GPS fallback if hardware GPS is down.</li>
            <li>4. Passengers see reliable location data regardless of GPS hardware failures.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}