export const initialRoutes = [
  { id: "1", from: "Kopargaon", to: "Kolpewadi", stops: ["Kopargaon", "Kolpewadi"] },
  { id: "2", from: "Kolpewadi", to: "Kopargaon", stops: ["Kolpewadi", "Kopargaon"] },
  { id: "3", from: "Kopargaon", to: "Rahata", stops: ["Kopargaon", "Rahata"] },
  { id: "4", from: "Rahata", to: "Kopargaon", stops: ["Rahata", "Kopargaon"] },
  { id: "5", from: "Kopargaon", to: "Yeola", stops: ["Kopargaon", "Yeola"] },
  { id: "6", from: "Yeola", to: "Kopargaon", stops: ["Yeola", "Kopargaon"] },
  { id: "7", from: "Kopargaon", to: "Shirdi", stops: ["Kopargaon", "Shirdi"] },
  { id: "8", from: "Shirdi", to: "Kopargaon", stops: ["Shirdi", "Kopargaon"] },
  { id: "9", from: "Kopargaon", to: "Sangamner", stops: ["Kopargaon", "Sangamner"] },
  { id: "10", from: "Sangamner", to: "Kopargaon", stops: ["Sangamner", "Kopargaon"] },
  { id: "11", from: "Kopargaon", to: "Shrirampur", stops: ["Kopargaon", "Shrirampur"] },
  { id: "12", from: "Shrirampur", to: "Kopargaon", stops: ["Shrirampur", "Kopargaon"] },
  { id: "13", from: "Kopargaon", to: "Manmad", stops: ["Kopargaon", "Manmad"] },
  { id: "14", from: "Manmad", to: "Kopargaon", stops: ["Manmad", "Kopargaon"] },
  { id: "15", from: "Kopargaon", to: "Ahilyanagar", stops: ["Kopargaon", "Ahilyanagar"] },
  { id: "16", from: "Ahilyanagar", to: "Kopargaon", stops: ["Ahilyanagar", "Kopargaon"] },
  { id: "17", from: "Kopargaon", to: "Nashik", stops: ["Kopargaon", "Nashik"] },
  { id: "18", from: "Nashik", to: "Kopargaon", stops: ["Nashik", "Kopargaon"] },
  { id: "19", from: "Kopargaon", to: "Pune", stops: ["Kopargaon", "Pune"] },
  { id: "20", from: "Pune", to: "Kopargaon", stops: ["Pune", "Kopargaon"] }
];

export const availableBusNumbers = [
  "MH13CU8472", "MH20BL4175", "MH14BT4175", "MH20BL4277", 
  "MH07C9206", "MH09EM9206", "MH11BL9206", "MH14BT2456", "MH17BD3310"
];

const generateTrips = () => {
  const tripSpecs = [
    { route: ["Kopargaon", "Kolpewadi"], count: 2 }, // Fixed to 2 buses
    { route: ["Kolpewadi", "Kopargaon"], count: 2 }, // Fixed to 2 buses
    { route: ["Kopargaon", "Rahata"], count: 2 },
    { route: ["Rahata", "Kopargaon"], count: 2 },
    { route: ["Kopargaon", "Yeola"], count: 2 },
    { route: ["Yeola", "Kopargaon"], count: 2 },
    { route: ["Kopargaon", "Shirdi"], count: 3 },
    { route: ["Shirdi", "Kopargaon"], count: 3 },
    { route: ["Kopargaon", "Sangamner"], count: 3 },
    { route: ["Sangamner", "Kopargaon"], count: 3 },
    { route: ["Kopargaon", "Shrirampur"], count: 2 },
    { route: ["Shrirampur", "Kopargaon"], count: 2 },
    { route: ["Kopargaon", "Manmad"], count: 2 },
    { route: ["Manmad", "Kopargaon"], count: 2 },
    { route: ["Kopargaon", "Ahilyanagar"], count: 3 },
    { route: ["Ahilyanagar", "Kopargaon"], count: 3 },
    { route: ["Kopargaon", "Nashik"], count: 3 },
    { route: ["Nashik", "Kopargaon"], count: 3 },
    { route: ["Kopargaon", "Pune"], count: 2 },
    { route: ["Pune", "Kopargaon"], count: 2 }
  ];

  const generated = [];
  let idCounter = 1;
  const driverNames = ["Ramesh Patil", "Suresh Gaikwad", "Vikas Shinde", "Dinesh Pawar", "Mahesh Kale"];

  tripSpecs.forEach(spec => {
    for (let i = 0; i < spec.count; i++) {
      const gpsMode = i % 2 === 0 ? "BUS_GPS" : "SMARTPHONE_GPS";
      const statusOptions = ["ON_TIME", "DELAYED", "STARTING_SOON"];
      const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      
      generated.push({
        id: `trip_live_${idCounter++}`,
        busNumber: availableBusNumbers[Math.floor(Math.random() * availableBusNumbers.length)],
        driverName: driverNames[Math.floor(Math.random() * driverNames.length)],
        from: spec.route[0],
        to: spec.route[1],
        currentLocation: `En route to ${spec.route[1]}`,
        liveCoordinates: { lat: 19.8 + (Math.random() * 0.1), lng: 74.4 + (Math.random() * 0.1) },
        etaMinutes: Math.floor(5 + Math.random() * 40),
        tripStatus: randomStatus,
        trackingSource: gpsMode,
        lastUpdated: `${Math.floor(1 + Math.random() * 59)} seconds ago`
      });
    }
  });
  return generated;
};

export const initialTrips = generateTrips();

export const initialDrivers = [
  { id: "drv_1", name: "Ramesh Patil", driverId: "DRV101", phone: "9876543210", email: "ramesh@demo.com", password: "123", status: "approved" },
  { id: "drv_2", name: "Suresh Gaikwad", driverId: "DRV102", phone: "9876543211", email: "suresh@demo.com", password: "123", status: "approved" },
  { id: "drv_3", name: "Vikas Shinde", driverId: "DRV103", phone: "9876543212", email: "vikas@demo.com", password: "123", status: "approved" },
  { id: "drv_4", name: "Dinesh Pawar", driverId: "DRV104", phone: "9876543213", email: "dinesh@demo.com", password: "123", status: "approved" },
  { id: "drv_5", name: "Mahesh Kale", driverId: "DRV105", phone: "9876543214", email: "mahesh@demo.com", password: "123", status: "approved" }
];