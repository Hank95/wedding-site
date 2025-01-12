import L from "leaflet";

// Define custom icons for different types of locations
const weddingIcon = new L.Icon({
  iconUrl: "/markers/marker-icon-2x-green.png",
  iconRetinaUrl: "/markers/marker-icon-2x-green.png",
  shadowUrl: "/markers/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const restaurantIcon = new L.Icon({
  iconUrl: "/markers/marker-icon-2x-blue.png",
  iconRetinaUrl: "/markers/marker-icon-2x-blue.png",
  shadowUrl: "/markers/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const hotelIcon = new L.Icon({
  iconUrl: "/markers/marker-icon-2x-red.png",
  iconRetinaUrl: "/markers/marker-icon-2x-red.png",
  shadowUrl: "/markers/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export { weddingIcon, restaurantIcon, hotelIcon };