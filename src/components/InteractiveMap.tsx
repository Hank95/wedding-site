import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import customIcon from "./customIcons";

const locations = [
  {
    name: "Legare Waring House",
    description: "Wedding Venue",
    lat: 32.8211,
    lng: -79.9861,
    website: "https://www.ccprc.com/1874/Legare-Waring-House",
  },
  {
    name: "Charleston International Airport",
    description: "Arrival Point",
    lat: 32.8986,
    lng: -80.0407,
    website: "https://www.iflychs.com/",
  },
  {
    name: "The Hilton Charleston",
    description: "Recommended Hotel",
    lat: 32.78225143554082,
    lng: -79.95565481025079,
    website:
      "https://www.hilton.com/en/hotels/chshhhf-hilton-charleston-historic-district/",
  },
  {
    name: "Marriott Charleston",
    description: "Recommended Hotel",
    lat: 32.78837451644069,
    lng: -79.95817074049997,
    website:
      "https://www.marriott.com/en-us/hotels/chsmc-charleston-marriott/overview/",
  },
  {
    name: "Moxy Charleston Downtown",
    description: "Recommended Hotel",
    lat: 32.79958186926953,
    lng: -79.94280894232321,
    website:
      "https://www.marriott.com/en-us/hotels/chsmx-moxy-charleston-downtown/overview/",
  },
];

interface Location {
  name: string;
  description: string;
  lat: number;
  lng: number;
  website: string;
}

function MapView({
  locations,
  selectedLocation,
  setSelectedLocation,
}: {
  locations: Location[];
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
}) {
  const map = useMap();
  const markerRefs = useRef<{ [key: string]: L.Marker }>({});

  useEffect(() => {
    const bounds = L.latLngBounds(locations.map((loc) => [loc.lat, loc.lng]));
    map.fitBounds(bounds);
  }, [map, locations]);

  useEffect(() => {
    if (selectedLocation) {
      const { lat, lng } = selectedLocation;
      map.setView([lat, lng], 14);
      const marker = markerRefs.current[`${lat},${lng}`];
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedLocation, map]);

  return (
    <>
      {locations.map((location) => (
        <Marker
          key={`${location.lat},${location.lng}`}
          position={[location.lat, location.lng]}
          icon={customIcon}
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
              <h4 className="text-lg font-semibold mb-2">{location.name}</h4>
              <p className="text-sm text-gray-600">{location.description}</p>
              <p className="text-xs text-sage-600 mt-2">
                Click to visit website
              </p>
            </a>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

export function InteractiveMap() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/3">
        <h3 className="text-2xl font-semibold mb-4 font-display">
          Important Locations
        </h3>
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
            </li>
          ))}
        </ul>
      </div>
      <div className="md:w-2/3 h-96 bg-sage-100 rounded-lg">
        <MapContainer
          center={[32.8211, -79.9861]}
          zoom={13}
          className="h-full w-full rounded-lg"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <MapView
            locations={locations}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
        </MapContainer>
      </div>
    </div>
  );
}
