import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { weddingIcon, restaurantIcon, hotelIcon } from "./customIcons";
// import Legend from "./Legend";

interface Location {
  name: string;
  description: string;
  lat: number;
  lng: number;
  address: string;
  type: string;
  website: string;
}

const locations: Location[] = [
  {
    name: "Legare Waring House",
    description: "Wedding Venue",
    lat: 32.80433621654174,
    lng: -79.98611524128754,
    address: "1500 Old Towne Rd, Charleston, SC 29407",
    type: "wedding",
    website: "https://southcarolinaparks.com/legare-waring-house",
  },
  {
    name: "Charleston International Airport",
    description: "Arrival Point",
    lat: 32.8986,
    lng: -80.0407,
    address: "5500 International Blvd, North Charleston, SC 29418",
    type: "wedding",
    website: "https://www.iflychs.com/",
  },
  {
    name: "The Hilton Charleston",
    description: "Recommended Hotel",
    lat: 32.78225143554082,
    lng: -79.95565481025079,
    address: "237 Meeting St, Charleston, SC 29401",
    type: "wedding",
    website:
      "https://www.hilton.com/en/hotels/chshhhf-hilton-charleston-historic-district/",
  },
  {
    name: "Marriott Charleston",
    description: "Recommended Hotel",
    lat: 32.78837451644069,
    lng: -79.95817074049997,
    address: "170 Lockwood Blvd, Charleston, SC 29403",
    type: "wedding",
    website:
      "https://www.marriott.com/en-us/hotels/chsmc-charleston-marriott/overview/",
  },
  {
    name: "The Oyster House",
    description: "Welcome Party",
    lat: 32.780628556206686,
    lng: -79.92810311349183,
    address: "66 State St, Charleston, SC 29401",
    type: "wedding",
    website: "https://oysterhouse.menu",
  },
  // Add more locations as needed
];

// Define a function to get the appropriate icon based on the location type
const getIcon = (type: string) => {
  switch (type) {
    case "wedding":
      return weddingIcon;
    case "restaurant":
      return restaurantIcon;
    case "hotel":
      return hotelIcon;
    default:
      return new L.Icon.Default();
  }
};

function MapView({
  locations,
  selectedLocation,
  markerRefs,
}: {
  locations: Location[];
  selectedLocation: Location | null;
  markerRefs: React.MutableRefObject<{ [key: string]: L.Marker }>;
}) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds(locations.map((loc) => [loc.lat, loc.lng]));
    map.fitBounds(bounds);
  }, [map, locations]);

  useEffect(() => {
    if (selectedLocation) {
      const { lat, lng } = selectedLocation;
      map.setView([lat, lng], 15);
      Object.values(markerRefs.current).forEach((marker) =>
        marker.closePopup()
      );
      const marker = markerRefs.current[`${lat},${lng}`];
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedLocation, map, markerRefs]);

  return null;
}

export function InteractiveMap() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [isMapLoading, setIsMapLoading] = useState(true);
  const markerRefs = useRef<{ [key: string]: L.Marker }>({});

  // Simulate map loading time
  useEffect(() => {
    const timer = setTimeout(() => setIsMapLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex flex-col md:flex-row gap-8">
      <div className="md:w-1/3">
        <h3 className="text-2xl font-semibold mb-4 font-display">
          Important Locations
        </h3>
        {/* <Legend /> */}
        <ul className="space-y-2">
          {locations.map((location, index) => (
            <li
              key={index}
              className={`cursor-pointer p-2 rounded-md ${
                selectedLocation === location
                  ? "bg-sage-200"
                  : "hover:bg-sage-100"
              }`}
              onClick={() => setSelectedLocation(location)}
            >
              <h4 className="font-semibold">{location.name}</h4>
              <p className="text-sm text-sage-600">{location.description}</p>
              <p className="text-sm text-sage-600">{location.address}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="md:w-2/3 h-96 bg-sage-100 rounded-lg relative z-0">
        {isMapLoading ? (
          <div className="h-full w-full flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-700 mx-auto mb-2"></div>
              <p className="text-sage-600">Loading map...</p>
            </div>
          </div>
        ) : (
          <MapContainer
            center={[32.80433621654174, -79.98611524128754]}
            zoom={13}
            className="h-full w-full rounded-lg"
          >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          {locations.map((location) => (
            <Marker
              key={`${location.lat},${location.lng}`}
              position={[location.lat, location.lng]}
              icon={getIcon(location.type)}
              ref={(ref) => {
                if (ref) {
                  markerRefs.current[`${location.lat},${location.lng}`] = ref;
                }
              }}
              eventHandlers={{
                click: () => {
                  setSelectedLocation(location);
                },
              }}
            >
              <Popup className="custom-popup">
                <a
                  href={location.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:bg-sage-100 transition-colors duration-200 rounded-md p-2"
                >
                  <h4 className="text-lg font-semibold mb-2">
                    {location.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {location.description}
                  </p>
                  <p className="text-sm text-gray-600">{location.address}</p>
                  <p className="text-xs text-sage-600 mt-2">
                    Click to visit website
                  </p>
                </a>
              </Popup>
            </Marker>
          ))}
          <MapView
            locations={locations}
            selectedLocation={selectedLocation}
            markerRefs={markerRefs}
          />
        </MapContainer>
        )}
      </div>
    </div>
  );
}
