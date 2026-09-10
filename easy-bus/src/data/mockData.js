export const initialRoutes = [
  { id: "1", from: "Kopargaon", to: "Kolpewadi", stops: ["Kopargaon Bus Stand", "Yesgaon", "Pohegaon", "Kolpewadi"] },
  { id: "2", from: "Shirdi", to: "Rahata", stops: ["Shirdi Stand", "Rui", "Rahata"] },
  { id: "3", from: "Yeola", to: "Kopargaon", stops: ["Yeola", "Ankai", "Kopargaon"] }
];

export const initialDrivers = [
  { id: "drv_1", name: "Ramesh Patil", driverId: "DRV101", phone: "9876543210", email: "ramesh@demo.com", password: "123", status: "approved" },
  { id: "drv_2", name: "Suresh Gaikwad", driverId: "DRV102", phone: "9876543211", email: "suresh@demo.com", password: "123", status: "pending" }
];

export const initialTrips = [
  {
    id: "trip_1",
    busNumber: "MH-14-BT-2456",
    from: "Kopargaon",
    to: "Kolpewadi",
    currentLocation: "Near Yesgaon",
    etaMinutes: 8,
    tripStatus: "ON_TIME",
    trackingSource: "BUS_GPS",
    lastUpdated: "15 seconds ago"
  },
  {
    id: "trip_2",
    busNumber: "MH-14-AB-7812",
    from: "Kopargaon",
    to: "Kolpewadi",
    currentLocation: "Near Kolhar",
    etaMinutes: 18,
    tripStatus: "DELAYED",
    trackingSource: "SMARTPHONE_GPS",
    lastUpdated: "8 seconds ago"
  }
];
