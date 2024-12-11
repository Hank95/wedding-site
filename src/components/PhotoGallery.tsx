import { useState } from "react";
import { X } from "lucide-react";

interface Location {
  name: string;
  images: string[];
}

const locations: Location[] = [
  {
    name: "London",
    images: [
      "/placeholder.svg?height=300&width=300&text=London+1",
      "/placeholder.svg?height=300&width=300&text=London+2",
      "/placeholder.svg?height=300&width=300&text=London+3",
    ],
  },
  {
    name: "St. Lawrence University",
    images: [
      "/placeholder.svg?height=300&width=300&text=St.+Lawrence+1",
      "/placeholder.svg?height=300&width=300&text=St.+Lawrence+2",
      "/placeholder.svg?height=300&width=300&text=St.+Lawrence+3",
    ],
  },
  {
    name: "Eagles Mere PA",
    images: [
      "/placeholder.svg?height=300&width=300&text=Eagles+Mere+1",
      "/placeholder.svg?height=300&width=300&text=Eagles+Mere+2",
      "/placeholder.svg?height=300&width=300&text=Eagles+Mere+3",
    ],
  },
  {
    name: "Newport RI",
    images: [
      "/placeholder.svg?height=300&width=300&text=Newport+1",
      "/placeholder.svg?height=300&width=300&text=Newport+2",
      "/placeholder.svg?height=300&width=300&text=Newport+3",
    ],
  },
  {
    name: "Charleston SC",
    images: [
      "/placeholder.svg?height=300&width=300&text=Charleston+1",
      "/placeholder.svg?height=300&width=300&text=Charleston+2",
      "/placeholder.svg?height=300&width=300&text=Charleston+3",
    ],
  },
];

export function PhotoGallery() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openLocation = (location: Location) => {
    setSelectedLocation(location);
  };

  const closeLocation = () => {
    setSelectedLocation(null);
  };

  const openImage = (image: string) => {
    setSelectedImage(image);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {locations.map((location) => (
          <button
            key={location.name}
            onClick={() => openLocation(location)}
            className="bg-sage-200 hover:bg-sage-300 text-sage-800 font-semibold py-4 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            {location.name}
          </button>
        ))}
      </div>

      {selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-sage-800">
                {selectedLocation.name}
              </h3>
              <button
                onClick={closeLocation}
                className="text-sage-600 hover:text-sage-800"
              >
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {selectedLocation.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${selectedLocation.name} ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg cursor-pointer transition-transform hover:scale-105"
                  onClick={() => openImage(image)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src={selectedImage}
              alt="Selected photo"
              className="max-w-full max-h-[90vh]"
            />
            <button
              onClick={closeImage}
              className="absolute top-4 right-4 text-white bg-sage-500 p-2 rounded-full"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
