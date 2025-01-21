import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { restaurantIcon, hotelIcon } from "../components/customIcons";

interface ActivityLocation {
  name: string;
  description: string;
  lat: number;
  lng: number;
  address: string;
  type: string;
  website?: string;
}

const activityLocations: ActivityLocation[] = [
  // Restaurants
  {
    name: "Leon's Oyster Shop",
    description: "Popular spot for oysters & fried chicken",
    lat: 32.798545559922424,
    lng: -79.94606743927764,
    address: "698 King St, Charleston, SC 29403",
    type: "restaurant",
    website: "https://leonsoystershop.com/",
  },
  {
    name: "Graft Wine Bar",
    description: "Intimate wine bar with small plates",
    lat: 32.79870546869047,
    lng: -79.94609927322949,
    address: "700 King St B, Charleston, SC 29403",
    type: "restaurant",
    website: "https://graftchs.com/",
  },
  {
    name: "Amen Street Fish & Raw Bar",
    description: "Seafood restaurant & raw bar",
    lat: 32.78036429169939,
    lng: -79.92733757875843,
    address: "205 E Bay St, Charleston, SC 29401",
    type: "restaurant",
    website: "https://amenstreet.com/",
  },
  {
    name: "Hank's Seafood Restaurant",
    description: "Classic Charleston seafood",
    lat: 32.78207235598717,
    lng: -79.92988254568589,
    address: "10 Hayne St, Charleston, SC 29401",
    type: "restaurant",
    website: "https://hanksseafoodrestaurant.com/",
  },
  {
    name: "Miller's All Day",
    description: "All-day breakfast & southern fare",
    lat: 32.77683868673805,
    lng: -79.93264011869833,
    address: "120 King St, Charleston, SC 29401",
    type: "restaurant",
    website: "https://millersallday.com/",
  },
  {
    name: "167 Raw",
    description: "Popular seafood & raw bar",
    lat: 32.779645701429416,
    lng: -79.93331617452144,
    address: "193 King St, Charleston, SC 29401",
    type: "restaurant",
    website: "https://167raw.com/charleston",
  },
  {
    name: "Chez Nous",
    description: "Intimate European dining",
    lat: 32.791946575231535,
    lng: -79.94327324753323,
    address: "6 Payne Ct, Charleston, SC 29403",
    type: "restaurant",
    website: "http://www.cheznouschs.com/",
  },
  {
    name: "Estadio",
    description: "Spanish tapas & wine",
    lat: 32.79073603578158,
    lng: -79.9480145542802,
    address: "122 Spring St, Charleston, SC 29403",
    type: "restaurant",
    website: "https://www.estadiochs.com/",
  },
  {
    name: "Chubby Fish",
    description: "Cozy spot for creative, locally-inspired seafood dishes.",
    lat: 32.793349953247635,
    lng: -79.94424447452097,
    address: "252 Coming St, Charleston, SC 29403",
    type: "restaurant",
    website: "https://chubbyfishchs.com/",
  },
  {
    name: "Lewis BBQ",
    description: "Texas-style BBQ",
    lat: 32.80893220421512,
    lng: -79.94658146102655,
    address: "464 N Nassau St, Charleston, SC 29403",
    type: "restaurant",
    website: "https://lewisbarbeque.com/",
  },
  {
    name: "Ellis Creek Fish Camp",
    description: "Waterfront seafood dining",
    lat: 32.75174912657747,
    lng: -79.95269503219295,
    address: "1243 Harbor View Rd, Charleston, SC 29412",
    type: "restaurant",
    website: "https://elliscreekfishcamp.com/",
  },

  // Activities & Attractions
  {
    name: "Rainbow Row",
    description: "Historic row of colorful houses",
    lat: 32.77601807897992,
    lng: -79.92716774294615,
    address: "83-107 E Bay St, Charleston, SC 29401",
    type: "activity",
  },
  {
    name: "Fort Sumter",
    description: "Historic Civil War fort",
    lat: 32.7521,
    lng: -79.8747,
    address: "340 Concord St, Charleston, SC 29401",
    type: "activity",
    website: "https://www.nps.gov/fosu/",
  },
  {
    name: "Charleston Museum",
    description: "America's First Museum",
    lat: 32.78977744113943,
    lng: -79.93563411685027,
    address: "360 Meeting St, Charleston, SC 29403",
    type: "activity",
    website: "https://www.charlestonmuseum.org/",
  },
  {
    name: "Gibbes Museum of Art",
    description: "Art museum in historic building",
    lat: 32.7776,
    lng: -79.9312,
    address: "135 Meeting St, Charleston, SC 29401",
    type: "activity",
    website: "https://www.gibbesmuseum.org/",
  },
  {
    name: "King Street Shopping",
    description: "Charleston's premier shopping district",
    lat: 32.7842,
    lng: -79.9371,
    address: "King Street, Charleston, SC 29401",
    type: "activity",
  },
  {
    name: "The Battery",
    description: "Historic waterfront promenade",
    lat: 32.7697,
    lng: -79.9311,
    address: "2 Murray Blvd, Charleston, SC 29401",
    type: "activity",
  },
  {
    name: "Shem Creek",
    description: "Waterfront dining & water activities",
    lat: 32.792,
    lng: -79.8831,
    address: "Shem Creek, Mt Pleasant, SC 29464",
    type: "activity",
  },
  {
    name: "Sullivan's Island",
    description: "Beach town & historic sites",
    lat: 32.7634,
    lng: -79.8435,
    address: "Sullivan's Island, SC 29482",
    type: "activity",
  },
  {
    name: "Folly Beach",
    description: "Vibrant beach community",
    lat: 32.6551,
    lng: -79.9403,
    address: "Folly Beach, SC 29439",
    type: "activity",
  },
  {
    name: "Charleston Municipal Golf Course",
    description: "Public golf course (Ask Henry for details!)",
    lat: 32.75813284579668,
    lng: -79.99390360381763,
    address: "2110 Maybank Hwy, Charleston, SC 29412",
    type: "activity",
    website: "https://www.charleston-sc.gov/589/Municipal-Golf-Course",
  },
];

// Choose icons by type
const getIcon = (type: string) => {
  // If you have a custom “activity” icon, replace hotelIcon below
  switch (type) {
    case "restaurant":
      return restaurantIcon;
    case "activity":
      return hotelIcon;
    default:
      return new L.Icon.Default();
  }
};

// Sub-component to handle map logic & zoom
function MapView({
  locations,
  selectedLocation,
  markerRefs,
}: {
  locations: ActivityLocation[];
  selectedLocation: ActivityLocation | null;
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

export default function ActivitiesMapPage() {
  const [selectedLocation, setSelectedLocation] =
    useState<ActivityLocation | null>(null);
  const markerRefs = useRef<{ [key: string]: L.Marker }>({});

  return (
    <div className="min-h-screen pt-24">
      {" "}
      {/* Add padding for header */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-5rem)] relative z-0">
        {" "}
        {/* Subtract header height */}
        {/* Left column: scrollable list (full width on mobile, 1/3 width on md+) */}
        <div className="md:w-1/3 h-1/2 md:h-full overflow-y-auto p-4 border-r border-gray-200">
          <h3 className="text-2xl font-semibold mb-4 font-display">
            Things to Do in Charleston
          </h3>
          <ul className="space-y-2">
            {activityLocations.map((location, index) => (
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
        {/* Right column: map fills the remaining space (1/2 height on mobile, full height on md+) */}
        <div className="md:w-2/3 h-1/2 md:h-full relative z-0">
          <MapContainer
            center={[32.7765, -79.9311]}
            zoom={13}
            className="w-full h-full"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            />
            {activityLocations.map((location) => (
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
                  click: () => setSelectedLocation(location),
                }}
              >
                <Popup>
                  <h4 className="text-lg font-semibold mb-1">
                    {location.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {location.description}
                  </p>
                  <p className="text-sm text-gray-600">{location.address}</p>
                  {location.website && (
                    <a
                      href={location.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sage-600 underline block mt-1"
                    >
                      Visit Website
                    </a>
                  )}
                </Popup>
              </Marker>
            ))}
            <MapView
              locations={activityLocations}
              selectedLocation={selectedLocation}
              markerRefs={markerRefs}
            />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
