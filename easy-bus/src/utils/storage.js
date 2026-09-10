import { initialRoutes, initialDrivers, initialTrips } from '../data/mockData';

export const getStore = (key, fallback) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
};

export const setStore = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const initStorage = () => {
  if (!localStorage.getItem("eb_routes")) setStore("eb_routes", initialRoutes);
  if (!localStorage.getItem("eb_drivers")) setStore("eb_drivers", initialDrivers);
  if (!localStorage.getItem("eb_trips")) setStore("eb_trips", initialTrips);
};
