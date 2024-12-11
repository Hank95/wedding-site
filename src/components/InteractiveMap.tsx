import { useState } from "react";

const locations = [
  {
    name: "Magnolia Plantation",
    description: "Wedding Venue",
    lat: 32.8764,
    lng: -80.0855,
  },
  {
    name: "Charleston International Airport",
    description: "Arrival Point",
    lat: 32.8986,
    lng: -80.0407,
  },
  {
    name: "Charleston Place",
    description: "Recommended Hotel",
    lat: 32.7816,
    lng: -79.9318,
  },
  {
    name: "The Vendue",
    description: "Recommended Hotel",
    lat: 32.7772,
    lng: -79.9272,
  },
  // Add more locations as needed
];

export function InteractiveMap() {
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);

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
      <div className="md:w-2/3 h-96 bg-sage-100 rounded-lg flex items-center justify-center">
        <p className="text-center text-sage-600">
          Interactive map placeholder. Integrate with a map service like Google
          Maps or Mapbox.
          <br />
          Selected location: {selectedLocation.name}
          <br />
          Coordinates: {selectedLocation.lat}, {selectedLocation.lng}
        </p>
      </div>
    </div>
  );
}
